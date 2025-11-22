 # apps/learning — enrollments, grades, assignments, course news

 Purpose
 - Manages the learning process: enrollments, gradebook, assignments, and notifications for students and teachers.

 Key components
 - __init__.py, apps.py, settings.py — learning subsystem configuration.
 - models.py — core learning entities, statuses, and roles.
 - admin.py — Django admin for learning objects.
 - forms.py — forms (gradebook/assignment operations, etc.).
 - tabs.py — tabs for student/teacher UI.
 - icalendar.py — export events to calendars.
 - services/ — domain services (e.g., student_group_service.py, notification_service.py, personal_assignment_service.py).
 - gradebook/ — gradebook modules.
 - teaching/ — teacher sub‑namespace (views/tests for teaching).
 - api/ — API serializers/views (serializers.py, views.py, test_api.py).
 - tasks.py — background jobs for learning.
 - migrations/, tests/
 - Templates: apps/templates/learning/** — UI for learning workflows.

 Relations
 - Integrates with `apps/courses`, `apps/users`, and `apps/notifications`.
