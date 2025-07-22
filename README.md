# Cope-FoRML Research Group Website

This is the official website for the Foundations of Responsible Machine Learning group at the University of Copenhagen.

## How to Add Publications & News

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

**That’s it!** News and publications will update automatically after deploy.
