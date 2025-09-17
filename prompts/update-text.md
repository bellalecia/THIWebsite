# Prompts — Update or Edit Text on a Page

Purpose
- Update, add, or remove text on any webpage in this repo using an AI assistant.

Before you start
1. Identify the page file under `nonprofit-website/src/` (e.g., `about.html`, `index.html`) or the shared `strings.js` entry if the content is driven by JavaScript (e.g., `nonprofit-website/src/js/strings.js`).
2. Make a small local backup (copy the file or create a Git branch).

Quick workflow
1. Copy the paragraph or the page section you want to change (or the `STRINGS` value) into the AI prompt.
2. Use one of the prompts below and paste the AI output into the HTML or `strings.js`.
3. Preview locally (Live Server or `python -m http.server 8000`) and commit the change.

AI prompt templates
- Shorten or simplify a paragraph
  "Rewrite the following paragraph to be clear, friendly, and under 75 words for our nonprofit website. Keep essential facts and remove jargon. Original paragraph: [PASTE PARAGRAPH]"

- Create multiple headline options
  "Generate 5 short, engaging headlines (6 words max) for a section about [TOPIC]. Tone: hopeful and community-focused."

- Turn a list of facts into a short paragraph
  "Combine these facts into one 40–60 word paragraph suitable for a website: [FACT 1]; [FACT 2]; [FACT 3]."

- Generate alt text for an image (see images.md for more)
  "Suggest 3 concise alt text options (max 125 chars) for an image showing: [BRIEF DESCRIPTION]."

- Create a commit message for the change
  "Suggest a concise Git commit message (imperative, <50 chars) for this change: [BRIEF DESCRIPTION OF CHANGE]"

Where to paste results
- If the content lives in `about.html` or another HTML file: open `nonprofit-website/src/<page>.html` and replace the old text between the tags.
- If the content is in `strings.js`: update the matching `STRINGS` property and ensure quotes and commas remain valid.

Tips
- Keep one change per commit so diffs are easy to review.
- Preview before pushing. If you can’t preview locally, create a branch and open a Pull Request so the team can review before merging.