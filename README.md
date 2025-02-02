# Phishing_Detection_extention

## Overview

Phishing Link Detector is a Chrome extension designed to help users identify potentially malicious links in real-time. It utilizes the Google Safe Browsing API to check URLs and alerts users when a link is unsafe. The extension provides visual indicators, prevents automatic navigation, and includes a manual URL checker.

## Features

-  Real-time phishing detection when hovering over links.
-  Manual URL checking through the popup interface.
-  Prevents automatic navigation to phishing sites.
-  Detects phishing links in emails (e.g., Gmail).
-  Uses Google Safe Browsing API for accurate threat analysis.
-  Toggleable functionality via the popup interface.

## Installation

1. Download the Source Code:
- Clone this repository or download the ZIP file.
 ```bash
git clone https://github.com/your-repo/phishing-link-detector.git
```

2. Open Chrome Extensions Page:
- Go to chrome://extensions/ in your browser.

3. Enable Developer Mode:
- Toggle the switch at the top-right corner.

4. Load the Extension:
- Click on Load unpacked.
- Select the folder containing the extension files.

5. Extension Installed!
- The extension should now be active and ready to use.

## Usage

### Automatic Link Detection
- Hover over any link on a webpage.
- Safe links will turn green with a ✅ tooltip.
- Phishing links will turn red with a ⚠️ warning tooltip.
### Email Link Scanning
- The extension scans links inside emails (e.g., Gmail).
- Safe links: Green border and ✅ message.
- Phishing links: Red border and ⚠️ warning.
### Manual URL Check
- Click the extension icon to open the popup.
- Enter a URL in the input box and press Check URL.
- Results will display whether the link is safe or unsafe.
### Toggle Detection
- Click the Toggle Button in the popup to enable/disable detection.
- Status is saved and persists across sessions.

## File Structure

📂 Phishing Link Detector
├── 📄 manifest.json        # Chrome extension configuration
├── 📄 background.js        # Handles API requests & message passing
├── 📄 content.js          # Detects links on web pages
├── 📄 inject.js           # Scans email links (Gmail, etc.)
├── 📄 popup.html          # Popup UI for manual checks & toggling
├── 📄 popup.js            # Handles popup interactions
├── 📄 styles.css          # Popup UI styling
├── 📄 icon.png            # Extension icon
