# UI/Web Accessibility Agent - Chrome Extension

An AI-powered Chrome extension that provides real-time design and accessibility feedback on any webpage using Google's Gemini API.

## Features

- 🎨 **Floating Assistant**: Draggable, resizable UI that stays on top of any webpage
- 🔍 **Three Analysis Modes**:
  - **Accessibility (WCAG Focus)**: Detailed accessibility audit with WCAG 2.1 guidelines
  - **UX Critique**: User experience evaluation and recommendations
  - **Branding Audit**: Brand identity and visual consistency analysis
- 💬 **Custom Queries**: Ask specific questions about the webpage design
- 📱 **Responsive Design**: Works on any screen size
- ⚡ **Real-time Analysis**: Instant feedback using Gemini Vision API

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- Google Chrome browser
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 3. Set Up API Key

```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
```

Or create a `.env` file in the server directory:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Start the Server

```bash
cd server
python server.py
```

The server will start on `http://localhost:5001`

### 5. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder from this project
5. The extension should now appear in your extensions list

### 6. Test the Setup

Run the test script to verify everything is working:

```bash
python test_extension.py
```

## Usage

1. **Load the Extension**: After loading the extension, visit any website
2. **Floating Assistant Appears**: A floating assistant will appear in the top-right corner
3. **Choose Analysis Mode**: Select from the dropdown:
   - **Accessibility**: Get WCAG 2.1 compliance feedback
   - **UX Critique**: User experience recommendations
   - **Branding Audit**: Brand identity analysis
4. **Get Feedback**: Click "Get Design Suggestion" to analyze the current page
5. **Custom Questions**: Use the text area to ask specific questions about the design
6. **Drag & Resize**: Move the assistant around and resize it as needed

## Analysis Modes

### Accessibility (WCAG Focus)
Provides detailed accessibility audit including:
- Color contrast issues
- Keyboard navigation problems
- Screen reader compatibility
- ARIA attribute recommendations
- HTML/CSS implementation details
- WCAG 2.1 guideline references

### UX Critique
Evaluates user experience aspects:
- Layout consistency
- Navigation flow
- Interactive elements
- Visual appeal
- Mobile responsiveness

### Branding Audit
Analyzes brand identity:
- Color scheme consistency
- Typography hierarchy
- Visual elements
- Brand voice and tone
- Recognition and memorability

## File Structure

```
slide_accessibility_checker/
├── chrome-extension/
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Background service worker
│   ├── assistant.js           # Content script for floating UI
│   ├── assistant.css          # Styles (if separate)
│   ├── assistant.html         # HTML template (if separate)
│   └── icon.png              # Extension icon
├── server/
│   ├── server.py             # Flask server with Gemini API
│   ├── prompts.py            # AI prompts for different modes
│   ├── requirements.txt      # Python dependencies
│   └── logging_config.py     # Logging configuration
├── test_extension.py         # Setup verification script
└── README.md                # This file
```

## Troubleshooting

### Extension Not Loading
- Check that all files are in the `chrome-extension` folder
- Verify `manifest.json` is valid JSON
- Check Chrome's extension page for error messages

### Server Connection Issues
- Ensure the server is running on port 5001
- Check firewall settings
- Verify the API key is set correctly

### API Errors
- Check your Gemini API key is valid
- Verify you have sufficient API credits
- Check the server logs for detailed error messages

### Floating Assistant Not Appearing
- Refresh the webpage after loading the extension
- Check browser console for JavaScript errors
- Ensure the extension is enabled

## API Usage and Credits

The extension uses Google's Gemini Pro Vision API. To check your API usage:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check your usage dashboard
3. Monitor your quota and billing

## Development

### Adding New Analysis Modes

1. Add the mode to `server/prompts.py`
2. Update the dropdown in `chrome-extension/assistant.js`
3. Test the new mode

### Customizing Prompts

Edit `server/prompts.py` to modify the AI prompts for each analysis mode.

### Styling Changes

Modify the CSS in `chrome-extension/assistant.js` to change the appearance of the floating assistant.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run `python test_extension.py` to diagnose problems
3. Check the server logs for detailed error messages
4. Open an issue on the repository with detailed information

## Option 1: Chrome Web Store (Recommended for Public Sharing)

### 1. Prepare Your Extension:
```bash
# Create a ZIP file of your chrome-extension folder
cd chrome-extension
zip -r ../design-assistant-extension.zip *
```

### 2. Chrome Web Store Process:
1. **Go to**: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. **Sign in** with your Google account
3. **Pay one-time fee**: $5 USD registration fee
4. **Upload your ZIP file**
5. **Fill out store listing**:
   - Extension name: "Floating Design Assistant"
   - Description: "AI-powered design and accessibility feedback tool"
   - Screenshots/videos of your extension in action
   - Privacy policy (required)

### 3. Store Listing Requirements:
- **High-quality screenshots** (1280x800px)
- **Detailed description** of features
- **Privacy policy** (since you're using AI APIs)
- **Clear usage instructions**

## Option 2: Direct Sharing (For Developers/Technical Users)

### 1. Create a GitHub Repository:
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Floating Design Assistant Chrome Extension"

# Create GitHub repo and push
# (You'll need to create the repo on GitHub first)
git remote add origin https://github.com/yourusername/design-assistant-extension.git
git push -u origin main
```

### 2. Create Installation Instructions:
Create a `README.md` with:
```markdown
# Floating Design Assistant Chrome Extension

## Installation (Developer Mode):
1. Download this repository
2. Open Chrome → chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome-extension` folder
6. Set up the server (see server/README.md)
```

## Option 3: Self-Hosted Distribution

### 1. Package for Distribution:
```bash
# Create a distribution package
mkdir distribution
cp -r chrome-extension distribution/
cp -r server distribution/
cp README.md distribution/
cp test_extension.py distribution/
cp check_api_credits.py distribution/

# Create installation script
echo '#!/bin/bash
echo "Installing Floating Design Assistant..."
cd server
pip install -r requirements.txt
echo "Installation complete! See README.md for setup instructions."
' > distribution/install.sh
chmod +x distribution/install.sh
```

### 2. Share the Package:
- Upload to Google Drive, Dropbox, or similar
- Share the download link
- Include setup instructions

## 📋 Important Considerations:

### **Privacy & Security:**
- **API Key Management**: Users need their own Gemini API key
- **Privacy Policy**: Required for Chrome Web Store
- **Data Handling**: Explain what data is processed

### **Documentation:**
- **Setup Guide**: How to get API key and start server
- **Usage Instructions**: How to use the extension
- **Troubleshooting**: Common issues and solutions

### **Legal:**
- **Terms of Service**: Usage terms
- **Privacy Policy**: Data handling practices
- **Attribution**: Credit for AI services used

## 🎯 Recommended Approach:

1. **Start with GitHub** (Option 2) for developer sharing
2. **Create comprehensive documentation**
3. **Get user feedback** and improve
4. **Then publish to Chrome Web Store** (Option 1) for public access

Would you like me to help you create any of these distribution packages or documentation? 
