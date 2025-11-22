 # frontend — buildable UI assets

 Purpose
 - Source code (JS/TSX and SCSS) and compiled/static assets for the LMS UI.

 High‑level layout
 - src/ — source code grouped under versioned namespaces (currently `v1/`).
 - assets/ — compiled bundles and static files (images, icons, vendor CSS, webpack stats).

 Build pipeline
 - Source under `src/v1/js` and `src/v1/scss` is compiled into `assets/v1/dist`.
 - Django templates load bundles via `django‑webpack‑loader` using `webpack-stats-v1.json`.

 Conventions
 - Keep page‑specific scripts in `src/v1/js/<area>/...` and shared components in `src/v1/js/components/`.
 - SCSS is split by domain: `scss/components`, `scss/pages`, plus shared overrides.
