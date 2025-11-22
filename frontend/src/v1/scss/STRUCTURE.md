 # frontend/src/v1/scss — SCSS sources

 Purpose
 - Styles for the v1 UI bundle: component‑, page‑, and site‑level styling.

 Structure
 - _bootstrap.custom.scss — Bootstrap overrides/customizations.
 - components/** — styles for reusable UI parts (cards, comments, cropper, jgrowl, sweetalerts, etc.).
 - pages/** — page‑specific styles (calendar, course_detail, courses_list_student, student submission comments, etc.).
 - center/** — branding and center‑specific styles; includes `center/_fonts.css` and pages.

 Build
 - Compiled together with JS entrypoints; outputs to `frontend/assets/v1/dist` as hashed CSS files.
