# HighLevel Bulk Delete Tool

A simple tool to bulk delete custom fields across all your HighLevel locations.

## Features
- Delete custom fields across all locations with a few clicks
- Preview deletion before executing
- Progress tracking for each deletion
- No installation required - works directly in browser

## Usage
1. Open `index.html` in your browser
2. Enter your HighLevel API key
   - Find this in HighLevel dashboard under Settings > API & Webhooks
3. Select the fields you want to delete
4. Preview and confirm deletion
5. Monitor progress in real-time

## Security
- Your API key is never stored or sent anywhere except directly to HighLevel's API
- All API calls are made directly from your browser to HighLevel
- No backend server or database involved

## Development
This is a simple static HTML file using:
- TailwindCSS for styling
- Vanilla JavaScript for functionality
- Direct API calls to HighLevel

To modify:
1. Edit `index.html`
2. Test locally by opening in browser
3. Deploy anywhere that serves static files 