 # apps/courses — courses, assignments, tabs, and permissions

 Purpose
 - Domain entities “Course/Assignment/Run,” services and API serializers, signals, and management commands.

 Layout
 - __init__.py, apps.py
 - models.py — core models for courses/assignments/schedules.
 - admin.py — Django admin configuration.
 - forms.py — forms for course/assignment management.
 - selectors.py, services.py — query helpers and business logic.
 - signals.py — reactions to domain events.
 - api/serializers.py — DRF serializers used by external endpoints.
 - views/ — user‑facing views (e.g., `course_student_faces.py`).
 - management/commands/recalculate_semester_indexes.py — maintenance command(s).
 - tabs.py, tabs_registry.py — UI tabs/navigation for course pages.
 - migrations/ — database migrations.
 - tests/ — tests for selectors/meta‑courses, etc.

 Relations
 - Tight integration with `apps/learning`, `apps/users`, and `apps/core`.
