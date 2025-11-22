 # lms/settings — Django settings
 
 Purpose
 - Project configuration split into multiple modules for different environments.
 
 Files
 - __init__.py — convenience imports.
 - base.py — base settings shared by all environments (installed apps, middleware, templates, DB, logging, i18n, Jinja2/Django template backends, crispy settings, etc.).
 - extended.py — overrides/extensions for production‑like deployments (email/backends, caches, security, storage, third‑party integrations, etc.).
 - test.py — testing settings (faster password hasher, in‑memory email backend, sqlite, etc.).
 
 Conventions
 - Use environment variables for secrets and host‑specific values.
 - Keep domain logic out of settings; prefer app‑level configuration.
