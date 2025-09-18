# Prompts — Update, Add, or Remove Download Buttons

Purpose
- Add or remove download buttons and wire them to files in `media/` (PDFs, images, etc.) using AI-generated snippets and instructions.

Before you start
1. Place files to be downloaded into `nonprofit-website/src/media/`.
2. Decide the button label and optional download filename.

AI prompt templates
- Add a download button HTML snippet
  "Create an accessible HTML button that downloads the file `media/FILE.pdf` when clicked, with visible text '[LABEL]'. Include an example `a` tag and a JS click handler if helpful."

- Remove a download button
  "Remove this download button from [PAGE]: `<a class=\"download-btn\" href=\"#\">Download Pledge Card</a>`. Provide the updated HTML and suggest how to remove the associated JS handler if present."

- Update button label and filename
  "Change the download button label from 'Download Pledge Card' to '[NEW LABEL]' and make it download `media/[NEWFILE].pdf`. Provide the exact HTML and a JS click handler snippet."

How to apply
- Add the file to `media/` and ensure the filename is URL-safe (replace spaces with hyphens or underscores).
- Use the provided HTML snippet in the page and add the JS snippet to the page's script (or `partner.js` if it's the partner page).
- Preview locally and click the button to verify it downloads the file.

Tips
- Use `download` attribute on `a` tag to suggest a filename; browsers may ignore it for cross-origin resources.
- Keep button text short and descriptive (e.g., 'Download Case Statement').