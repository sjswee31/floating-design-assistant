// === assistant.js ===
function initializeFloatingAssistant() {
  console.log('Initializing floating assistant...');

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #floating-assistant {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 320px;
      min-width: 280px;
      max-width: 500px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 16px;
      z-index: 9999;
      resize: both;
      overflow: auto;
      max-height: 80vh;
    }

    #floating-assistant .header {
      cursor: move;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: -16px -16px 16px -16px;
      user-select: none;
    }

    #floating-assistant .header::before {
      content: "🎨";
      font-size: 16px;
    }

    #floating-assistant select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 12px;
      background: white;
    }

    #floating-assistant textarea {
      width: 100%;
      height: 80px;
      margin: 8px 0;
      padding: 10px;
      font-family: inherit;
      font-size: 13px;
      border: 1px solid #ddd;
      border-radius: 6px;
      resize: vertical;
      min-height: 60px;
      box-sizing: border-box;
    }

    #floating-assistant button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      margin: 8px 0;
      transition: all 0.2s ease;
      text-align: center;
      box-sizing: border-box;
    }

    #floating-assistant button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    #floating-assistant button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .font-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .font-controls label {
      font-size: 12px;
      font-weight: 600;
      color: #495057;
      min-width: 60px;
    }

    .font-size-display {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      color: #495057;
      min-width: 40px;
      text-align: center;
    }

    .font-btn {
      width: auto !important;
      padding: 6px 12px !important;
      margin: 0 !important;
      font-size: 12px !important;
      min-width: 30px;
    }

    .font-section {
      margin: 12px 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .font-section-title {
      font-size: 12px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
      text-align: center;
    }

    .font-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }

    .font-row label {
      font-size: 11px;
      font-weight: 600;
      color: #495057;
      min-width: 80px;
    }

    .color-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .color-controls label {
      font-size: 12px;
      font-weight: 600;
      color: #495057;
      min-width: 60px;
    }

    .color-picker {
      width: 40px;
      height: 30px;
      border: 2px solid #000000;
      border-radius: 4px;
      cursor: pointer;
      background: white;
    }

    .color-picker::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .color-picker::-webkit-color-swatch {
      border: none;
      border-radius: 3px;
    }

    .color-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }

    .color-row label {
      font-size: 11px;
      font-weight: 600;
      color: #495057;
      min-width: 80px;
    }

    .feedback-section {
      margin-top: 16px;
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }

    .feedback-section .query-time {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .feedback-section .feedback-content {
      max-height: 300px;
      overflow-y: auto;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #e9ecef;
    }

    .loading-indicator {
      font-size: 12px;
      color: #666;
      display: none;
      margin-left: 5px;
    }

    .error-message {
      color: #dc3545;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 8px;
    }

    .success-message {
      color: #155724;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);

  // Create and inject the floating assistant HTML
  const floatingAssistant = document.createElement('div');
  floatingAssistant.id = 'floating-assistant';
  floatingAssistant.innerHTML = `
    <div class="header">Design Assistant</div>
    <div id="assistant-content">
      <select id="modeSelect">
        <option value="accessibility">Accessibility (WCAG Focus)</option>
        <option value="ux">UX Critique</option>
        <option value="branding">Branding Audit</option>
      </select>
      <button id="checkBtn">Web Design Assistant <span class="loading-indicator">⏳ Processing...</span></button>
      <textarea id="customPrompt" placeholder="Ask a custom question or give specific instructions..."></textarea>
      <button id="customBtn">Ask Gemini <span class="loading-indicator">⏳ Processing...</span></button>
      <div class="font-section">
        <div class="font-section-title">Font Controls</div>
        <div class="font-row">
          <label>Output Text:</label>
          <button id="decreaseOutputFontBtn" class="font-btn">A-</button>
          <div class="font-size-display" id="outputFontSizeDisplay">13px</div>
          <button id="increaseOutputFontBtn" class="font-btn">A+</button>
        </div>
        <div class="font-row">
          <label>Headings:</label>
          <button id="decreaseHeadingFontBtn" class="font-btn">A-</button>
          <div class="font-size-display" id="headingFontSizeDisplay">14px</div>
          <button id="increaseHeadingFontBtn" class="font-btn">A+</button>
        </div>
      </div>
      <div class="color-controls">
        <div class="color-row">
          <label>Background:</label>
          <input type="color" class="color-picker" id="backgroundPicker" value="#ffffff">
        </div>
        <div class="color-row">
          <label>Header:</label>
          <input type="color" class="color-picker" id="headerPicker" value="#667eea">
        </div>
      </div>
      <div class="feedback-section">
        <div class="query-time">Query Time: 0s</div>
        <div class="feedback-content" id="feedback"></div>
      </div>
    </div>
  `;

  document.body.appendChild(floatingAssistant);
  console.log('Floating assistant HTML injected');

  // Initialize elements
  const checkBtn = document.getElementById('checkBtn');
  const customBtn = document.getElementById('customBtn');
  const modeSelect = document.getElementById('modeSelect');
  const customPrompt = document.getElementById('customPrompt');
  const feedbackDiv = document.getElementById('feedback');
  const queryTimeDiv = document.querySelector('.feedback-section .query-time');
  const decreaseOutputFontBtn = document.getElementById('decreaseOutputFontBtn');
  const increaseOutputFontBtn = document.getElementById('increaseOutputFontBtn');
  const decreaseHeadingFontBtn = document.getElementById('decreaseHeadingFontBtn');
  const increaseHeadingFontBtn = document.getElementById('increaseHeadingFontBtn');
  const outputFontSizeDisplay = document.getElementById('outputFontSizeDisplay');
  const headingFontSizeDisplay = document.getElementById('headingFontSizeDisplay');
  const backgroundPicker = document.getElementById('backgroundPicker');
  const headerPicker = document.getElementById('headerPicker');

  // Font size management
  let currentOutputFontSize = 13;
  let currentHeadingFontSize = 14;
  const minFontSize = 10;
  const maxFontSize = 24;

  function updateFontSize() {
    // Update output text font size
    feedbackDiv.style.fontSize = `${currentOutputFontSize}px`;
    outputFontSizeDisplay.textContent = `${currentOutputFontSize}px`;
    
    // Update heading font sizes for main UI elements
    const header = floatingAssistant.querySelector('.header');
    const checkBtn = document.getElementById('checkBtn');
    const customBtn = document.getElementById('customBtn');
    
    if (header) header.style.fontSize = `${currentHeadingFontSize}px`;
    if (checkBtn) checkBtn.style.fontSize = `${currentHeadingFontSize}px`;
    if (customBtn) customBtn.style.fontSize = `${currentHeadingFontSize}px`;
    
    headingFontSizeDisplay.textContent = `${currentHeadingFontSize}px`;
    
    // Save to localStorage for persistence
    localStorage.setItem('assistant-output-font-size', currentOutputFontSize);
    localStorage.setItem('assistant-heading-font-size', currentHeadingFontSize);
  }

  function loadSavedFontSize() {
    const savedOutput = localStorage.getItem('assistant-output-font-size');
    const savedHeading = localStorage.getItem('assistant-heading-font-size');
    if (savedOutput) {
      currentOutputFontSize = parseInt(savedOutput);
    }
    if (savedHeading) {
      currentHeadingFontSize = parseInt(savedHeading);
    }
    updateFontSize();
  }

  // Font size button handlers
  decreaseOutputFontBtn.addEventListener('click', () => {
    if (currentOutputFontSize > minFontSize) {
      currentOutputFontSize--;
      updateFontSize();
    }
  });

  increaseOutputFontBtn.addEventListener('click', () => {
    if (currentOutputFontSize < maxFontSize) {
      currentOutputFontSize++;
      updateFontSize();
    }
  });

  decreaseHeadingFontBtn.addEventListener('click', () => {
    if (currentHeadingFontSize > minFontSize) {
      currentHeadingFontSize--;
      updateFontSize();
    }
  });

  increaseHeadingFontBtn.addEventListener('click', () => {
    if (currentHeadingFontSize < maxFontSize) {
      currentHeadingFontSize++;
      updateFontSize();
    }
  });

  // Load saved font size on initialization
  loadSavedFontSize();

  // Add loading state class
  function setLoadingState(button, loading) {
    button.disabled = loading;
    button.classList.toggle('loading', loading);
    button.querySelector('.loading-indicator').style.display = loading ? 'inline' : 'none';
  }

  // Send message to background script
  function sendMessageToBackground(action, data) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (chrome.runtime.lastError || !response) {
          console.error('Message error:', chrome.runtime.lastError);
          reject({ error: true, message: 'Failed to communicate with background script' });
        } else {
          resolve(response);
        }
      });
    });
  }

  // Handle button clicks
  async function handleButtonClick(button, mode, prompt = null) {
    setLoadingState(button, true);
    feedbackDiv.textContent = '';
    const startTime = Date.now();

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      button.querySelector('.loading-indicator').textContent = `⏳ ${seconds}s`;
      queryTimeDiv.textContent = `Query Time: ${seconds}s`;
    }, 1000);

    try {
      const data = mode === 'custom' ? { mode, prompt } : { mode };
      const response = await sendMessageToBackground('capture', data);

      clearInterval(timer);
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      
      if (response.error) {
        feedbackDiv.innerHTML = `<div class="error-message">Error: ${response.message}</div>`;
        queryTimeDiv.textContent = `Query Time: ${finalTime}s (error)`;
      } else {
        feedbackDiv.innerHTML = `<div class="success-message">Analysis complete!</div><div style="margin-top: 8px;">${response.feedback || 'No feedback received from the AI.'}</div>`;
        queryTimeDiv.textContent = `Query Time: ${finalTime}s (completed)`;
      }
    } catch (error) {
      clearInterval(timer);
      feedbackDiv.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
      queryTimeDiv.textContent = `Query Time: 0s (error)`;
    } finally {
      setLoadingState(button, false);
    }
  }

  // Set up button click handlers
  checkBtn.addEventListener('click', () => handleButtonClick(checkBtn, modeSelect.value));
  customBtn.addEventListener('click', () => {
    const prompt = customPrompt.value.trim();
    if (!prompt) {
      feedbackDiv.innerHTML = '<div class="error-message">Please enter your question.</div>';
      return;
    }
    handleButtonClick(customBtn, 'custom', prompt);
  });

  // Reset feedback when mode changes
  modeSelect.addEventListener('change', () => {
    feedbackDiv.textContent = '';
    queryTimeDiv.textContent = 'Query Time: 0s';
  });

  // Reset feedback when custom prompt changes
  customPrompt.addEventListener('input', () => {
    feedbackDiv.textContent = '';
    queryTimeDiv.textContent = 'Query Time: 0s';
  });

  // Drag functionality
  const box = floatingAssistant;
  const dragHandle = floatingAssistant.querySelector('.header');
  let isDragging = false, offsetX = 0, offsetY = 0;

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - box.offsetLeft;
    offsetY = e.clientY - box.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - box.offsetWidth;
      const maxY = window.innerHeight - box.offsetHeight;
      
      box.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      box.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Prevent text selection while dragging
  dragHandle.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });

  // Background color picker
  backgroundPicker.addEventListener('input', () => {
    const color = backgroundPicker.value;
    box.style.backgroundColor = color;
    localStorage.setItem('assistant-background-color', color);
  });

  // Load saved background color
  const savedColor = localStorage.getItem('assistant-background-color');
  if (savedColor) {
    backgroundPicker.value = savedColor;
    box.style.backgroundColor = savedColor;
  }

  // Header color picker
  headerPicker.addEventListener('input', () => {
    const color = headerPicker.value;
    const header = box.querySelector('.header');
    header.style.background = color;
    localStorage.setItem('assistant-header-color', color);
  });

  // Load saved header color
  const savedHeaderColor = localStorage.getItem('assistant-header-color');
  if (savedHeaderColor) {
    headerPicker.value = savedHeaderColor;
    const header = box.querySelector('.header');
    header.style.background = savedHeaderColor;
  }
}

// Initialize the floating assistant when the window is loaded
window.addEventListener('load', () => {
  if (document.body) {
    initializeFloatingAssistant();
  } else {
    setTimeout(() => {
      if (document.body) {
        initializeFloatingAssistant();
      } else {
        console.error('Failed to initialize assistant: body not found');
      }
    }, 1000);
  }
});
