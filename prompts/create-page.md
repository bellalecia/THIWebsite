# Prompts — Create a New Page

Purpose
- Create a new static page for the site using AI-generated HTML and suggestions for images and metadata.

Before you start
1. Choose a filename and page title (e.g., `nonprofit-website/src/programs.html`).
2. Decide whether the page will use `strings.js` for content or be a standalone HTML file.

AI prompt templates
- Generate a complete accessible HTML page
  "Create an accessible static HTML page for '[PAGE TITLE]' with a header, hero, 3 content sections, and a footer. Keep the layout consistent with other site pages and include placeholder image filenames and alt text. Page title: [PAGE TITLE]."

- Create a `strings.js` entry for the new page
  "Produce a JavaScript object to add to `STRINGS` for a page called [PAGE_KEY]. Include a title, intro paragraph, and 3 cards with titles and short descriptions."

- Create file metadata and commit message
  "Create a short meta description (<=160 chars) and an SEO-friendly title (<=60 chars) for a page about [TOPIC]. Then suggest a Git commit message for adding the file."

How to integrate the generated page
1. If you created a standalone HTML page: save it to `nonprofit-website/src/<filename>.html` and link it from the navigation (`index.html` or shared include). Preview locally.
2. If using `strings.js`: add the generated object under `STRINGS` and update `includes.js` or the relevant page script to read from the new key.

Tips
- Add any images to `nonprofit-website/src/media/Programs` or `Partners` and reference them with relative paths.
- Keep pages simple and test on mobile (reduce large hero heights if needed).