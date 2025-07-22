# Amartya Group Website – README (v2)

A minimalist **Eleventy (11ty) + Tailwind CSS** static site for Amartya’s research group at the University of Copenhagen. The site is deploy‑ready for GitHub Pages and designed so group members can update content by adding Markdown, YAML, or BibTeX files through pull‑requests.

---

## 📁 Directory tree

```
.
├── .eleventy.js               # Build config & collections
├── tailwind.config.js         # Accent colour via CSS variable
├── postcss.config.js          # Autoprefixer
├── package.json               # Scripts & dev deps
├── .github/
│   └── workflows/deploy.yml   # CI build → gh‑pages branch
├── data/
│   ├── people.yaml            # All group members (photo, role, ORCID …)
│   ├── topics.yaml            # 5 research areas (privacy, theory …)
│   └── publications.bib       # Master BibTeX (extra `topic` + `tags` fields)
├── content/
│   ├── news/2025-07-placeholder.md
│   └── openings/phd-fall-2025.md
├── scripts/
│   └── build-pubs.js          # BibTeX → JSON & author cross‑linking
├── src/
│   ├── assets/
│   │   ├── tailwind.css       # @tailwind base/components/utilities
│   │   └── images/placeholder-hero.jpg
│   ├── components/ThemeSwitcher.njk
│   ├── layouts/
│   │   ├── base.njk           # Global shell & typography
│   │   └── … (people, pubs)
│   └── index.njk              # Landing page (fixes 404)
└── README.md (this file)
```

---

## 🖥️ Local development

```bash
# Requires Node ≥ 20
npm install        # install dev deps
npm run dev        # http://localhost:8080 with hot‑reload
```

* `npm run dev` does two things in parallel:

  1. Watches `src/assets/tailwind.css` with Tailwind JIT and outputs `_site/assets/site.css`.
  2. Runs 11ty’s dev‑server (port 8080 by default).

### Common scripts

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Local dev with live reload           |
| `npm run build` | One‑off production build to `_site/` |

---

## 🚀 Deployment on GitHub Pages

On every push to **`main`**:

1. GitHub Action checks out code, installs deps.
2. Runs `npm run build`.
3. Publishes the `_site` folder to the `gh-pages` branch.
4. Pages is already configured to serve that branch → site live at `https://<user>.github.io/<repo>/`.

---

## 🌈 Accent‑colour theme switcher

*Accent colour* is stored in the CSS custom property `--accent`.

```css
:root              { --accent: #970000; }  /* red (default) */
[data-theme=blue]  { --accent: #00427A; }
[data-theme=green] { --accent: #006B3C; }
```

`ThemeSwitcher.njk` toggles `data-theme` on `<html>` and saves the choice in `localStorage`, so Tailwind classes like `text-accent` or `bg-accent` update instantly.

---

## ➕ Adding content (PR workflow)

| Task              | File(s) to edit                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **New paper**     | Paste BibTeX into `data/publications.bib`, set `topic` and `tags`, add PDF under `src/assets/papers/` |
| **New member**    | Append a YAML block to `data/people.yaml`                                                             |
| **News post**     | Add Markdown file under `content/news/` (front‑matter with `title` & `date`)                          |
| **Open position** | Markdown under `content/openings/`                                                                    |

> **CI checks**: The GitHub Action lints the BibTeX and verifies any `pdf`, `code`, or `video` links resolve (skips for drafts).

---

## 📝  Notable implementation details

* **Index page** (`src/index.njk`) fixes the “Cannot GET /” issue you saw by providing a root route.
* `.eleventy.js` now:

  * adds a *News* collection sorted by date;
  * gracefully handles a missing `publications.bib` during first build.
* `build-pubs.js` parses authors and injects cross‑links so each person’s page lists their own publications.

---

## 📮 Need help?

Open an issue or tag @Amartya in the repo – happy to refine the setup as the group grows.
