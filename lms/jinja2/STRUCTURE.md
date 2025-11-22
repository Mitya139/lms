 # lms/jinja2 — Jinja2 templates for the LMS shell
 
 Purpose
 - Project‑level Jinja2 templates (layouts, macros, and pages) that compose UI across apps.
 
 Layout overview
 - lms/layouts/** — base layouts and partials (e.g., `v2_base.html`, `_v2_top_menu.html`).
 - lms/macros/** — reusable UI macros (e.g., `_assignment_detail.jinja2`, `_forms.jinja2`, `_faces.jinja2`, `_global.jinja2`).
 - lms/** — feature pages (courses, gradebook, user_profile, learning, etc.).
 
 Notes
 - Django config (`lms/settings/base.py`) registers the Jinja2 backend and global context; see also `apps/core/jinja2` for extensions/globals used here.
 - For app‑specific Django templates, see `apps/templates/**`.
