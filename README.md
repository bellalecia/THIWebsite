<<<<<<< HEAD
# THIWebsite

The Harambee Initiative website with dynamic content management capabilities and Azure-powered infrastructure.

## Features

- **Dynamic Board of Directors**: Board members are managed via Azure Function API with admin interface
- Azure Function API for real-time board member management 
- HTML admin interface for non-technical users to update board information
- Static fallback content when JavaScript is disabled
- Responsive design with mobile-friendly navigation

## Dynamic Content Management

The Board of Directors section loads dynamically from an Azure Function API, allowing non-technical users to update board information through a web-based admin interface.

### System Architecture:
- **Azure Function API**: `harambee-board-api.azurewebsites.net/api/board-members` - RESTful API for board data
- **Azure Blob Storage**: `harambeedata` storage account for data persistence
- **Admin Interface**: `nonprofit-website/admin.html` - Web interface for board management
- **Frontend Integration**: `nonprofit-website/src/js/board-data-config.js` - API integration

### Files involved:
- `nonprofit-website/admin.html` - Admin interface for board member management
- `nonprofit-website/src/js/about.js` - Loads board data on About page
- `nonprofit-website/src/js/partner.js` - Loads board data on Partner page  
- `nonprofit-website/src/js/board-data-config.js` - API configuration and data fetching
- `azure-function/` - Azure Function API source code

## Project Goals
- Provide a minimal, accessible, and documented website for THI
- Enable non-technical users to manage board member information without code deployment
- Show a repeatable pattern for using AI agents and Azure cloud services for nonprofit websites
- Provide guidance for deploying to Azure with minimal configuration

## Quick preview (local)
1. Open the project folder in your editor (VS Code recommended)
2. Serve the `nonprofit-website/src` directory with any static file server:
   - VS Code Live Server extension (recommended for non-technical users)
   - Python (if installed): `python -m http.server 8000` from inside `nonprofit-website/src`
3. Open `http://localhost:8000` to preview the site
4. For admin functions, open `http://localhost:8000/../admin.html`

## Project structure
=======
# THIWebsite

A lightweight, easy-to-maintain static website for The Harambee Initiative (THI). This repo was created during a hackathon to demonstrate how non-technical teams can use simple static-site structure plus AI-driven prompts and tooling to build, update, and deploy a nonprofit website in the Azure ecosystem.

## Project goals
- Provide a minimal, accessible, and documented website for THI.
- Keep site structure simple so non-technical maintainers can update content (HTML, images, JSON data, and JS text files).
- Show a repeatable pattern for using AI agents and prompts to automate content updates and common maintenance tasks.
- Provide guidance for deploying the site to Azure (Static Web Apps or App Service) with minimal configuration.

## Quick preview (local)
1. Open the project folder in your editor (VS Code recommended).
2. Serve the `nonprofit-website/src` directory with any static file server (examples):
   - VS Code Live Server extension (recommended for non-technical users).
   - Python (if installed): `python -m http.server 8000` from inside `nonprofit-website/src`.
3. Open `http://localhost:8000` (or the port Live Server shows) to preview the site.

## Project structure
Top-level files:
- `harambee_website.html` — legacy or quick-preview root HTML file.
- `README.md` — this file.
- `THI Case Statement.pdf` — supporting organization document.

Main site folder: `nonprofit-website/`
- `README.md` — local notes specific to this subproject (if present).
- `src/` — website source (static files)
  - `index.html` — home page
  - `about.html`, `get-involved.html`, `partner.html` — other site pages
  - `css/harambee.css` — main stylesheet
  - `js/` — client-side scripts
    - `main.js`, `about.js`, `get-involved.js`, `partner.js`, `strings.js`
  - `data/board.json` — small JSON data file used by the site (e.g., board members)
  - `media/` — images and program assets used across pages
    - `Partners/` and `Programs/` subfolders

Keep the site structure flat and obvious so volunteers can find and edit pages and assets easily.

## How to make common edits
- To update page content: edit the corresponding HTML file in `nonprofit-website/src/`.
- To change styles: edit `nonprofit-website/src/css/harambee.css`.
- To update copy used by JavaScript-driven UI: edit `nonprofit-website/src/js/strings.js`.
- To add or replace images: add files under `nonprofit-website/src/media/Programs` or `Partners` and update the HTML image `src` attributes.
- To manage simple structured data (board members, partners): update `nonprofit-website/src/data/board.json`.

Notes for non-technical editors:
- Use descriptive filenames for images (no spaces ideally; use hyphens or underscores).
- Make small, incremental changes and preview locally before publishing.
- Keep backups of original files (copy to a `backup/` folder or Git branch) before major edits.

## AI toolkit & prompts (recommended workflow)
This project was built with the idea that AI prompts and small generator scripts can reduce manual work. Suggested approach for future users:
1. Collect the content you want: page text, image captions, board bios (as plain text or CSV)
2. Use an AI assistant (or simple prompt templates) to generate: updated HTML snippets, concise bios, alt text for images, or accessibility checks
3. Review and copy the generated snippets into the appropriate HTML/CSS/JS files

Example prompt templates (for an AI assistant):
- "Given this volunteer bio, produce a 50–70 word biography suitable for a website 'About' page. Keep language friendly and avoid jargon."
- "Create accessible alt text suggestions for these images: [list of filenames]."
- "Rewrite this paragraph to be clear, short, and suitable for our nonprofit audience."

Store commonly used prompts and examples in a `prompts/` folder if you plan to reuse the AI workflows.

## Deploying to Azure (overview)
The current setup uses Azure services for both hosting and dynamic content:

**Current Azure Infrastructure:**
- **Azure Function App**: `harambee-board-api` - REST API for board member management
- **Azure Blob Storage**: `harambeedata` - persistent data storage
- **Static Web App**: For hosting the main website (recommended)

**Deployment Options:**

1) Azure Static Web Apps (recommended for static sites)
- Setup: Connect the GitHub repository to Azure Static Web Apps via Azure Portal
- Build settings: Set the app artifact location to `nonprofit-website/src`
- Pros: Free tier available, automatic GitHub CI/CD, easy rollback

2) Azure Blob Storage + Static Website or App Service (alternative)
- Blob Storage with Static Website hosting can serve files directly from a storage container
- App Service can host static sites but is more commonly used for server-backed apps

Basic manual deploy (for developers):
- Use the Azure CLI:
  - `az login`
  - `az staticwebapp create --name <app-name> --resource-group <rg> --location <location> --source <repo-url> --branch main --app-location "nonprofit-website/src"`
- Or use GitHub Actions provided by the Static Web App setup for automatic deployment on push

## Technical Architecture

**Board Management System:**
- Azure Function API handles CRUD operations for board members
- Data persisted in Azure Blob Storage as JSON
- Admin web interface provides user-friendly management
- Website dynamically loads board data via JavaScript

**Dependencies:**
- Azure Function runtime for API hosting
- Azure Blob Storage for data persistence  
- Modern web browser with JavaScript enabled for full functionality
- Static web server for local development

## Checklist for handoffs to nonprofit staff
- [ ] Provide account access instructions for GitHub and Azure (or create an organization account)
- [ ] Train staff on using the admin interface for board member updates
- [ ] Create a short 'how to update' doc showing how to edit pages, add images, and preview locally
- [ ] Save frequently used AI prompts and example outputs in the `prompts/` folder
- [ ] Identify one or two staff members as maintainers and give them permissions
- [ ] Document Azure Function API endpoints and admin interface location

## Troubleshooting tips
- **Board members not loading**: Check that Azure Function API is accessible and CORS is configured
- **Admin interface not working**: Verify API endpoints are correct in admin.html
- **Page looks broken after a change**: Preview locally and use browser console to check for missing files (404s) or JS errors
- **CSS not applied**: Ensure the `link` href path is correct relative to the HTML file
- **Image not visible**: Confirm filename and path under `media/`, and avoid spaces in filenames
- **API errors**: Check Azure Function logs in Azure Portal for detailed error messages

## Contributing
This project was built with the idea that AI prompts and small generator scripts can reduce manual work. Suggested approach for future users:
1. Collect the content you want: page text, image captions, board bios (as plain text or CSV).
2. Use an AI assistant (or simple prompt templates) to generate: updated HTML snippets, concise bios, alt text for images, or accessibility checks.
3. Review and copy the generated snippets into the appropriate HTML/CSS/JS files.

Example prompt templates (for an AI assistant):
- "Given this volunteer bio, produce a 50–70 word biography suitable for a website 'About' page. Keep language friendly and avoid jargon."
- "Create accessible alt text suggestions for these images: [list of filenames]."
- "Rewrite this paragraph to be clear, short, and suitable for our nonprofit audience."

Store commonly used prompts and examples in a `docs/` or `prompts/` folder if you plan to reuse the AI workflows.

## Deploying to Azure (overview)
Two common simple ways to host this static site on Azure:

1) Azure Static Web Apps (recommended for static sites)
- Setup: Connect the GitHub repository to Azure Static Web Apps (via the Azure Portal). Azure will create a GitHub Actions workflow that builds and deploys the `nonprofit-website/src` folder.
- Build settings: Set the app artifact location to `nonprofit-website/src`.
- Pros: Free tier available, automatic GitHub CI/CD, easy rollback.

2) Azure Blob Storage + Static Website or App Service (alternative)
- Blob Storage with Static Website hosting can serve files directly from a storage container.
- App Service can host static sites but is more commonly used for server-backed apps.

Basic manual deploy (for developers):
- Use the Azure CLI (example):
  - `az login`
  - `az staticwebapp create --name <app-name> --resource-group <rg> --location <location> --source <repo-url> --branch main --app-location "nonprofit-website/src"`
- Or use GitHub Actions provided by the Static Web App setup for automatic deployment on push.

## Checklist for handoffs to nonprofit staff
- [ ] Provide account access instructions for GitHub and Azure (or create an organization account).
- [ ] Create a short 'how to update' doc showing how to edit a page, add images, and preview locally.
- [ ] Save frequently used AI prompts and example outputs in a `prompts/` folder.
- [ ] Identify one or two staff members as maintainers and give them permissions.

## Troubleshooting tips
- Page looks broken after a change: preview locally and use the browser console to check for missing files (404s) or JS errors.
- CSS not applied: ensure the `link` href path is correct relative to the HTML file (check `css/harambee.css`).
- Image not visible: confirm filename and path under `media/`, and avoid spaces in filenames.

## Contributing
Small edits can be done via pull requests. For larger changes, create a feature branch, test locally, then open a PR with a clear description of the change and screenshots if applicable.

## Credits & License
- Created by the THI hackathon team
- Built with Azure cloud services and modern web technologies
- Keep content and media ownership details up-to-date. If using third-party images, ensure you have rights to publish them

---
Last updated: 2025-01-16

