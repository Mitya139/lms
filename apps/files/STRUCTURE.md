 # apps/files — file storage and delivery

 Purpose
 - Unified place for file operations: models, storage backends, conversion, and download views.

 Files and directories
 - __init__.py, apps.py
 - models.py — file metadata/links.
 - storage.py — storage backend (S3/local, etc.).
 - handlers.py — file event/signal handlers.
 - response.py — specialized HTTP responses for file delivery.
 - utils.py — conversion/helpers (e.g., ipynb → html).
 - tasks.py — background tasks (conversions, etc.).
 - views.py — download/preview views.
 - migrations/, tests/
