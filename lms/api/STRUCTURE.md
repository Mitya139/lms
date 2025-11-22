 # lms/api — project‑level API helpers
 
 Purpose
 - Glue for project‑level API concerns that don’t belong to a single domain app.
 
 Files
 - __init__.py — package marker.
 - serializers.py — shared DRF serializers used across multiple apps.
 
 Notes
 - Endpoint routing typically lives in domain apps (see apps/*/api). This package hosts cross‑cutting serializers/utilities only.
