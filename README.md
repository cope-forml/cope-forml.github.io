# FoRML Research Group Website

This is the official website for the Foundations of Responsible Machine Learning group at the University of Copenhagen.

## Local Setup, Build, and Preview

### Prerequisites

- Node.js (LTS recommended) and npm
- macOS: install Node.js (includes npm) via Homebrew:
  ```sh
  brew install node
  ```

### Install dependencies

```sh
npm install
```

### Build the site (one-off)

```sh
npm run build
```

The generated site is written to `_site/`.

### Run a local dev server (with live rebuild)

```sh
npm run dev
```

This starts Eleventy’s dev server and watches Tailwind CSS. Open the local URL printed in the terminal.

## How to Add Publications, News, and Blog Posts

### Add a Publication

1. Edit `data/publications.bib`.
2. Add your BibTeX entry with `author`, `title`, `booktitle`/`journal`, and `year` (plus optional `pdf`, `tags`, etc.).
3. Save and commit the file:

   ```sh
   git add data/publications.bib
   git commit -m "Add new publication"
   git push
   ```

### Add a News Item

1. Create a new file in `src/content/newslist/`, named like `2025-07-title.md`.
2. Use this template:

   ```markdown
   ---
   title: News Title
   date: YYYY-MM-DD
   featured: true  # Optional, Not working yet
   ---
   News content goes here.
   ```
3. Save and commit:

   ```sh
   git add src/content/newslist/2025-07-title.md
   git commit -m "Add news"
   git push
   ```

### Add a Blog Post

1. Create a new file in `src/content/blog/`, named like `2026-01-my-post.md`.
2. Use this template:

   ```markdown
   ---
   title: Blog Post Title
   date: YYYY-MM-DD
   author: Firstname Lastname
   summary: One-sentence teaser for the blog list page.
   image_dir: /assets/blog/your-post-slug
   ready: true
   ---
   Your blog post content goes here (Markdown supported).
   ```
   Shortcodes available inside blog posts:

   ```njk
   {% callout 'TL;DR', 'tldr' %}
   - Point one
   - Point two
   {% endcallout %}

   {% callout 'Key idea', 'key' %}
   This is a highlighted callout.
   {% endcallout %}

   {% figure image_dir ~ '/figure.png', 'Alt text' %}
   Figure 1: Caption text.
   {% endfigure %}
   ```
3. Create a per-post image folder in `src/assets/blog/your-post-slug/` (PNG/JPG/PDF supported).
4. Reference images in Markdown using `{{ image_dir }}/figure.png`.
5. Save and commit:

   ```sh
   git add src/content/blog/2026-01-my-post.md src/assets/blog/your-post-slug/your-image.png
   git commit -m "Add blog post"
   git push
   ```

**That’s it!** News, publications, and blog posts will update automatically after deploy.
