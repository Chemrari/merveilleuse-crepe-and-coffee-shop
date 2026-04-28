# Merveilleuse Crepe & Coffee Shop

Static multi-page website for a crepe and coffee shop in Destin, Florida.

## Overview

This project uses:
- HTML
- Tailwind CSS (local compiled build)
- Vanilla JavaScript

Main features:
- Shared navbar and footer in `components/`
- Automatic component loading through `components/components-loader.js`
- Active link highlighting in the navbar
- Contact form with Formspree
- Local review system with `localStorage`
- Homepage review preview
- Local Tailwind CSS build instead of the CDN runtime

## Pages

- `index.html`: homepage with hero, highlights, and guest reviews
- `menu.html`: featured items and full menu
- `Gallery.html`: photo gallery
- `about.html`: brand story and cafe presentation
- `contact.html`: contact info, form, map, and reviews

## Project structure

```text
/
|-- index.html
|-- menu.html
|-- Gallery.html
|-- about.html
|-- contact.html
|-- components/
|   |-- navbar.html
|   |-- footer.html
|   `-- components-loader.js
|-- assets/
|   |-- css/
|   |   |-- site.css
|   |   `-- tailwind-built.css
|   |-- images/
|   `-- js/
|       `-- contact-reviews.js
|-- scripts/
|   `-- build-tailwind.mjs
|-- package.json
|-- package-lock.json
`-- README.md
```

## Local setup

Important: the site should be served with a local server, not opened with `file://`, because shared components are loaded with `fetch()`.

### Install dependencies

```powershell
cmd /c npm install
```

### Build Tailwind CSS

```powershell
cmd /c npm run build:css
```

Re-run this command whenever you add or change Tailwind utility classes in the HTML, components, or JS files.

### Run locally

Option 1: VS Code

1. Install the **Live Server** extension
2. Open the project folder
3. Open `index.html` with Live Server

Option 2: Python

```powershell
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/index.html
```

## Quick edits

- Navbar: `components/navbar.html`
- Footer: `components/footer.html`
- Shared loader logic: `components/components-loader.js`
- Main custom styles: `assets/css/site.css`
- Compiled Tailwind output: `assets/css/tailwind-built.css`
- Menu content: `menu.html`
- Reviews logic: `assets/js/contact-reviews.js`
- Images: `assets/images/...`

## Technical notes

- Reviews are stored in browser `localStorage` using:
  - `merveilleuse_reviews_v1`
- The contact form posts to Formspree from `contact.html`
- Tailwind is compiled locally through `scripts/build-tailwind.mjs`

## Author

Built for Merveilleuse Crepe & Coffee Shop.