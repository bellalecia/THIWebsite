# THIWebsite

The Harambee Initiative website with dynamic content management capabilities.

## Features

- **Dynamic Board of Directors**: Board members are loaded from `nonprofit-website/src/data/board.json` and can be updated via Microsoft Forms or Excel Online using Power Automate
- Static fallback content when JavaScript is disabled
- Responsive design with mobile-friendly navigation

## Dynamic Content Setup

The Board of Directors section on both the About and Partner pages loads dynamically from a JSON file. This allows non-technical users to update board information through forms.

### Files involved:
- `nonprofit-website/src/data/board.json` - Board member data
- `nonprofit-website/src/js/about.js` - Loads board data on About page
- `nonprofit-website/src/js/partner.js` - Loads board data on Partner page

### Setting up automated updates:
See `POWER_AUTOMATE_SETUP.md` for detailed instructions on connecting Microsoft Forms or Excel Online to automatically update the board member list.

## Local Development

1. Serve the `nonprofit-website/src/` directory with a local web server
2. The site will automatically load board data from `data/board.json`
3. If the JSON file is missing or fails to load, it falls back to static data from `js/strings.js`