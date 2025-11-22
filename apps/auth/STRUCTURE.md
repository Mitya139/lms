 # apps/auth — auth forms, views, and permission mixins

 Purpose
 - User authentication flows: sign‑in/registration forms, backends, middleware, and permission mixins.

 Layout
 - __init__.py
 - apps.py — Django app config.
 - urls.py — routes (login/logout/password reset, etc.).
 - views.py — classic Django views (FormView/TemplateView) for auth flows.
 - forms.py — authentication/recovery/registration forms.
 - backends.py — authentication backends.
 - middleware.py — helper middleware for user context.
 - mixins.py — mixins for CBV/permissions.
 - permissions.py — object/role permissions (for DRF and class‑based views).
 - models.py — auxiliary models (sessions/tokens/logs if any).
 - services.py — business logic and scenarios.
 - registry.py — registry of roles/permissions.
 - settings.py — local constants/settings.
 - storage.py — storage backends (e.g., avatars/temp files).
 - tasks.py — background tasks (Celery/RQ).
 - errors.py, utils.py — exceptions and helpers.
 - migrations/ — model migrations.
 - tests/ — unit/integration tests (factories.py, test_*).

 Integration
 - Works with `apps/users` (profiles, roles) and integrates with DRF via `permissions.py`.

 Extension points
 - Swap backends via settings.AUTHENTICATION_BACKENDS.
 - Plug middleware and URL patterns.
