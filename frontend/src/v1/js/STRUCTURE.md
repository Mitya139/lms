 # frontend/src/v1/js — JavaScript/TypeScript sources

 Purpose
 - Page scripts, React components, and feature screens for the v1 UI bundle.

 Notable subfolders and files
 - components/ — reusable UI components (`Card.tsx`, `Checkbox.tsx`, `CheckboxButton.jsx`).
 - courses/ — course‑related scripts (`courseDetails.js`, `courseOfferings.js`).
 - screens/
   - AssignmentsCheckQueue/ — React screens for assignment checking queue (e.g., `AssignmentsCheckQueue.jsx`, `CourseFilterForm.jsx`).
   - CitySelect/ — City selection widget/entrypoint.
 - supervising/ — scripts for supervising views (`course_offering.js`).
 - mathjax_config.js — MathJax configuration used by pages requiring formulas.

 Build
 - Webpack discovers entrypoints here; outputs bundles to `frontend/assets/v1/dist` with hashed names.
