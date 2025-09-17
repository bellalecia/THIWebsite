HOWTO — Editing and Publishing the THI Website

This short guide is written for non-technical staff. It explains how to make simple edits, preview them locally, and publish changes via GitHub (which can trigger automatic deployment to Azure Static Web Apps).

1) Make a small content change
- Open `nonprofit-website/src` in your editor (VS Code is recommended).
- Edit the page you need: `index.html`, `about.html`, or `get-involved.html`.
- Save your change.

2) Preview locally (easy option)
- Install the Live Server extension in VS Code.
- Right-click `index.html` and choose "Open with Live Server".
- The site will open in your browser. Make edits, save, and the browser will refresh automatically.

3) Preview locally (command-line)
- If you prefer a simple server and have Python installed, open a terminal and run:
  python -m http.server 8000
  Then open http://localhost:8000 in your browser while in `nonprofit-website/src`.

4) Add or update images
- Place images into `nonprofit-website/src/media/Programs` or `Partners`.
- Use descriptive filenames (no spaces; use hyphens or underscores).
- Update the `src` attribute in the HTML to point to the new file.

5) Commit changes and push to GitHub
- Use GitHub Desktop, VS Code Source Control, or the command line to create a commit with a short message (e.g., "Update about page copy").
- Push the commit to the `main` branch or create a Pull Request for review.

6) Deployment notes
- This project is configured to deploy automatically to Azure Static Web Apps when changes are pushed to `main` (if the Azure Static Web App is connected and the repo secret `AZURE_STATIC_WEB_APPS_API_TOKEN` is configured).
- If you are unsure about deployment, ask your site administrator before pushing to `main`.

7) Screenshots and where to store them
- Take screenshots of important changes or bugs and save them in a `docs/screenshots/` folder.
- When creating a PR, attach screenshots to help reviewers.

Helpful tips
- Keep changes small and test locally before pushing.
- Use the `prompts/templates.md` file to help generate better copy with an AI assistant.
- If a page breaks after a change, check for missing file paths or a syntax error in the HTML.

Support
- If you're not sure about a change, create a Pull Request and ask a team member to review.
- Maintain a `backup/` folder for original files before major edits.
