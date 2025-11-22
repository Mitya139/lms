 # apps/notifications — notifications subsystem

 Purpose
 - Centralized event/notification logic: generation, delivery, and CLI commands for sending/cleanup.

 Files
 - __init__.py, apps.py
 - models.py — notification types/states.
 - notifications.py — registry/configuration of notifications.
 - service.py — delivery services (in‑app, email, etc.).
 - signals.py — reacts to domain events (learning/courses, etc.).
 - tasks.py — background dispatch jobs.
 - management/commands/*.py — commands like `send_notifications`, `read_stale_notifications`.
 - migrations/, tests/
