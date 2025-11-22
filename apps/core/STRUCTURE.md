 # apps/core — shared primitives and infrastructure

 Purpose
 - Base models/utilities for the whole project: validation, time/timezone helpers, template tags, Jinja2 utilities, tasks, and reports.

 Key directories and modules
 - __init__.py, apps.py
 - models.py — shared models/mixins (e.g., SiteConfiguration, base entities).
 - validators.py, exceptions.py — common exceptions and validators.
 - timezone/, db/ — DB utilities and timezone‑aware fields/helpers.
 - jinja2/ — Jinja2 extensions and globals.
 - templatetags/core_tags.py — Django template tags.
 - templates/ — templates (e.g., admin/widgets overrides).
 - tasks.py — generic background tasks.
 - reports.py — report/export helpers.
 - api/ — core‑level API helpers (seed package).
 - management/commands/ — management commands (when present).
 - migrations/ — extensive set of core migrations.
 - tests/ — tests for utilities (db/tests/* etc.).

 Relations
 - Used by almost every other app (fields, validators, templates, tags, utilities).
