# Prompts — Update, Add, or Remove Images

Purpose
- Use AI for writing alt text, captions, and image selection suggestions and then add, replace, or remove images from pages.

Before you start
1. Know where images are stored: `nonprofit-website/src/media/Programs` and `nonprofit-website/src/media/Partners`.
2. Keep original images backed up in `media/backup/` before replacing.

AI prompt templates
- Generate alt text
  "Generate 3 accessible alt text options (max 125 chars) for an image showing: [BRIEF DESCRIPTION]."

- Suggest filename and caption
  "Suggest a concise filename (use hyphens, no spaces) and a 10–15 word caption for an image showing: [BRIEF DESCRIPTION]."

- Replace an image on a page
  "I want to replace the image at `<img src="media/Programs/OLD.JPG">` with a new image `media/Programs/NEW.JPG`. Provide the exact HTML line to replace and a suggested alt text."

- Remove an image safely
  "I want to remove the following image tag from [PAGE]: `<img src=\"media/Programs/OLD.JPG\">`. Provide the updated HTML snippet without the image and a suggested caption to add in its place if needed."

How to apply image changes
- Copy new images to the appropriate `media/` folder and use hyphenated filenames (e.g., `program-yoga.jpg`).
- Update the `src` in the HTML file and add a descriptive `alt` attribute.
- Preview locally to verify paths and sizing.

Tips
- Use `.webp` or `.jpg` for best browser support and reasonable file sizes.
- If an image is large, create a web-optimized version (80–1200px wide depending on use) and store the original in `media/backup/`.