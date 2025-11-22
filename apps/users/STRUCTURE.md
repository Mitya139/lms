 # apps/users — users, profiles, and roles

 Purpose
 - Custom user models, student profiles, role/permission logic, API serializers, and services.

 Layout
 - __init__.py, apps.py
 - models.py — user/profile/role models.
 - admin.py — Django admin for users.
 - forms.py — registration/edit/search forms, etc.
 - constants.py, roles.py — constants and role rules.
 - services.py — user operations (creation/invitations, etc.).
 - signals.py — reacts to events (profile creation, updates, etc.).
 - tasks.py — background jobs related to users.
 - templatetags/ — template tags (e.g., user_thumbnail).
 - api/serializers.py — DRF serializers.
 - migrations/ — numerous migrations for profile/status fields.
 - tests/ — unit and integration tests.
 - templates: apps/templates/users/** — UI templates.
