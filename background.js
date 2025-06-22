// === background.js ===
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture") {
    console.log('Starting capture process...');
    
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      if (chrome.runtime.lastError) {
        console.error('Error capturing tab:', chrome.runtime.lastError.message);
        sendResponse({
          error: true,
          message: "Failed to capture tab"
        });
        return;
      }

      console.log('Captured image data URL');
      console.log('Sending request to server...');

      fetch("http://localhost:5001/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          mode: request.mode,
          prompt: request.prompt
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Sending feedback to content script');
          sendResponse({
            success: true,
            feedback: data.feedback,
            processing_time: data.processing_time || 0
          });
        })
        .catch(err => {
          console.error('Error:', err);
          sendResponse({
            error: true,
            message: `Error: ${err.message}`
          });
        });
    });
    return true; // Keep the channel open for async response
  }
});
