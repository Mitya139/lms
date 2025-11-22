 # frontend/assets — compiled bundles and static assets

 Purpose
 - Output of the frontend build and static assets served by Django.

 Layout
 - v1/
   - dist/ — compiled JS/CSS bundles and local chunk files; includes `webpack-stats-v1.json` for django‑webpack‑loader.
   - img/ — images/icons (SVGs, placeholders, branding).
   - css/vendor/highlight-styles — vendor styles for code highlighting.

 Notes
 - The backend templates reference bundles via the stats file; do not edit files in `dist/` manually.
