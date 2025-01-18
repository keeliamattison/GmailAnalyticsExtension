# Gmail Analytics Extension
A birds-eye view of your Gmail inbox (or other Gmail pages). See where most of your emails are coming from.

# Email Analytics Dashboard

A Chrome extension that provides real-time analytics and visualization of your Gmail inbox patterns. Track email domain distributions and gain insights into your email communications.

## Features

- Real-time email analysis
- Track total number of analyzed emails
- Display count of unique email domains
- Visualize top email domains with interactive progress bars
- Auto-refreshing statistics (every 5 seconds)
- Clean, modern user interface

## Installation

1. Clone this repository:
   ```bash
   git clone [repository-url]
   ```
   1a. Or download the ZIP file and unzip it in your local File Explorer

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage

1. After installation, the extension icon will appear in your Chrome toolbar
2. Navigate to Gmail (https://mail.google.com)
3. Click the extension icon to view your email analytics
4. The dashboard will automatically update as you browse through your emails

## Disclamer
- This current version does NOT include use in other mailing sites (i.e Outlook, HotMail, Yahoo)

## Technical Details

### Components

- **popup.html/js**: Handles the user interface and data visualization
- **contentScript.js**: Extracts email data from Gmail interface
- **background.js**: Processes and manages email statistics
- **manifest.json**: Extension configuration and permissions

### Architecture

The extension works by:
1. Scanning email data from the Gmail interface using DOM manipulation
2. Processing and storing email statistics using Chrome's storage API
3. Displaying real-time visualizations in the popup interface

### Permissions Required

- `activeTab`: For accessing current tab content
- `storage`: For storing email statistics
- Host permission for `mail.google.com`

## Privacy

- All data processing happens locally within your browser
- No data is sent to external servers
- Only processes visible email data in the Gmail interface


### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension card
4. Changes will be reflected immediately

### Troubleshooting

If no data is being read/displayed:
1. Make sure you are in the Gmail tab in your Chrome browser.
2. Try refreshing the tab and then activating the extension (the flags the "active" component)
