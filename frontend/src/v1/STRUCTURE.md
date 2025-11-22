 # frontend/src/v1 — v1 UI sources

 Purpose
 - First generation of the current UI bundle: page scripts, React widgets, and SCSS.

 Layout
 - js/
   - components/ — shared UI components (e.g., `Card.tsx`, `Checkbox.tsx`, `CheckboxButton.jsx`).
   - courses/ — course pages logic (e.g., `courseDetails.js`, `courseOfferings.js`).
   - screens/ — larger screens/features (e.g., `AssignmentsCheckQueue/*`, `CitySelect/*`).
   - supervising/ — supervising tools (e.g., `course_offering.js`).
   - mathjax_config.js — MathJax setup for rendering formulas.
 - scss/
   - _bootstrap.custom.scss — Bootstrap overrides.
   - components/** — component‑level styles (cards, comments, cropper, jgrowl, sweetalerts, etc.).
   - pages/** — page‑level styles (calendar, course_detail, courses_list_student, submission comments, etc.).
   - center/** — center site branding/fonts and pages.

 Build
 - Entrypoints are defined by webpack; outputs land in `frontend/assets/v1/dist`.
