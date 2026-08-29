# Radwan Eldaly — Portfolio

A premium, editorial-style personal portfolio built with plain HTML, CSS and vanilla
JavaScript, animated with GSAP + ScrollTrigger.

## Run it

No build step. Just open `index.html` in a browser, or serve the folder with
any static server, e.g.:

```bash
npx serve .
```

## Structure

```
index.html
css/style.css
js/main.js
assets/images/   → project images (placeholders included)
assets/icons/
```

## Replace the project images

Each project tile is image-only (name + category + year appear on hover) — no
description text is used anywhere in the Work section, as requested.

Just overwrite these files with your own screenshots, keeping the same names:

```
assets/images/disney-kidz.jpg
assets/images/kemo-store.jpg
assets/images/gnoce-store.jpg
assets/images/portfolio.jpg
```

Recommended: portrait images, roughly 1000×1250px or larger, JPG or WebP.
If you rename a file, update the matching `src` in `index.html` inside the
`.work-tile__media` blocks.

## Add or remove a project

Copy one `<article class="work-tile">...</article>` block inside `.work__grid`
in `index.html`, update the image `src`, the `work-tile__index` number, the
`work-tile__name`, and the `work-tile__tags` line (category · year — no
description).

## Editing content

- **Hero, About, Contact copy** — plain text inside `index.html`, no build step needed.
- **Focus / capabilities lists** — inside the `.focus__grid` section.
- **Colors & type** — all defined as CSS variables at the top of `css/style.css`
  under `:root`. Change `--bg`, `--ink`, `--accent`, etc. in one place.
- **Fonts** — Fraunces (display) + Inter (body/UI), loaded from Google Fonts in
  `index.html`. Swap the `<link>` tag and the `--font-display` / `--font-body`
  variables to change them.

## Notes

- Respects `prefers-reduced-motion` — animations are skipped/simplified automatically.
- Custom cursor and hover-only interactions are disabled on touch devices.
- Fully keyboard-navigable: work tiles are focusable and open with Enter/Space.
- No frameworks, no build tools, no dependencies beyond the GSAP CDN scripts.
