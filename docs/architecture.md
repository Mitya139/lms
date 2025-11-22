# LMS Architecture Overview

This document gives a high‑level overview of the LMS codebase, runtime stack, and
the main data and control flows between components.

## Repository Layout
- **apps/** – Django apps that implement domain logic:
  - `core/` – cross‑cutting utilities (locks, markdown, soft‑delete, menu, middleware, etc.).
  - `auth/` – authentication and authorization helpers on top of Django auth.
  - `courses/` – course catalogue, offerings and course‑level configuration.
  - `learning/` – student learning process, assignments, solutions, grades.
  - `notifications/` – email‑based notifications and scheduling (see `docs/notifications.md`).
  - `tasks/` – background/queue‑driven tasks that support the learning process.
  - `users/`, `staff/`, `alumni/`, `universities/`, `study_programs/` – user profiles,
    educational organizations and longer‑lived entities.
  - `files/` – file storage helpers and views, including S3 vs local storage logic.
  - other apps such as `faq/`, `info_blocks/`, `templates/` provide supporting UI content.
- **lms/** – Project configuration (settings, URLs, WSGI/ASGI entrypoints).
  - `settings/base.py` – core settings and environment loading.
  - `settings/extended.py` – additional settings used by this LMS deployment.
- **frontend/** – Webpack + JS/React source (`src/v1`) and build configs under `webpack/`.
- **docs/** – Existing reference docs (API usage, deployment, notifications, student groups, etc.).
- **docker-files/**, **helm/**, **skaffold.yaml** – Container and Kubernetes deployment assets.

## Runtime Stack
- **Backend:** Django 4.2 with environment‑driven configuration (`lms/settings/base.py`).
- **Database:** PostgreSQL accessed via the Django ORM (see `docs/setup.md` and `README.md`).
- **Cache/Broker:** Redis for caching and background jobs.
- **Storage:** AWS S3 (or compatible) when `USE_CLOUD_STORAGE=1`; local filesystem
  storage when `USE_CLOUD_STORAGE=0`, using `DJANGO_PUBLIC_MEDIA_ROOT` and
  `DJANGO_PRIVATE_MEDIA_ROOT`.
- **Frontend build:** Node 20 + Webpack 5, with `webpack-bundle-tracker` producing
  `webpack-stats-v1.json` that is consumed by Django templates via `WEBPACK_LOADER`.

## Frontend Build Pipeline
1. Install JS dependencies in `frontend/`:
   - `npm install`
2. Build a local development bundle:
   - `npm run local:1` – sets `LOCAL_BUILD=1`, `DEBUG=1` and runs the production
     build config in a "local" mode.
3. Webpack emits assets into `frontend/assets/v1/dist/<env>` (for example
   `frontend/assets/v1/dist/local`) and writes `webpack-stats-v1.json` that Django
   loads through `WEBPACK_LOADER` in `lms/settings/base.py`.
4. Optionally build only CSS:
   - `npm run build:css` – runs `webpack/styles.config.js` and outputs styles into
     `frontend/assets/v1/dist/css`.

## Backend Request Flow
1. **HTTP entrypoint.**
   - The browser sends HTTP(S) requests to Django endpoints defined in `lms/urls.py`.
2. **Middleware chain.**
   - Requests pass through Django and project‑specific middleware
     (sessions, authentication, locale, notifications cache, etc.).
3. **View and domain logic.**
   - Views in `apps/*` validate input, interact with models and services
     (for example soft‑delete services in `apps/core/services.py`), and prepare
     responses.
4. **Rendering.**
   - HTML responses are rendered with templates that include Webpack bundles
     discovered via `webpack-stats-v1.json`.
   - JSON/REST responses are handled through DRF‑based APIs (see `docs/api.md`).
5. **Static and media files.**
   - Static assets are collected with `collectstatic` into `STATIC_ROOT` and
     served by Django or a fronting web server in development.
   - Media files are either proxied from S3 (cloud mode) or served from the
     local filesystem when `USE_CLOUD_STORAGE=0`.
6. **Background and async work.**
   - Redis queues (via `django_rq` and similar tooling) are used by jobs such as
     `apps/core/tasks.py::compute_model_fields` and various notification senders.

## Domain Concepts
- **Courses and offerings.**
  - A course represents a subject; offerings and semester settings live in
    `apps/courses/`. Public APIs for courses and enrollments are documented in
    `docs/api.md`.
- **Students and groups.**
  - Students enroll into courses and are partitioned into *student groups* that
    control supervision responsibilities (see `docs/student_groups.md`).
- **Assignments and learning.**
  - The `learning` app models assignments, solutions, grades and related
    workflows. Notifications ("new assignment", "deadline changed", "new
    comment", etc.) are driven by activity in this app.
- **Notifications.**
  - Email notifications are described in detail in `docs/notifications.md`.
  - They are sent by scheduled commands and background workers, and stored in
    several models depending on notification type.

## Data & Control Flow Overview
```
Browser (JS/React bundles + HTML templates)
    ↓
Django URL routing (lms/urls.py)
    ↓
Middleware (auth, sessions, locale, notifications)
    ↓
Views / services (apps/*, ORM, soft‑delete, validation)
    ↓
PostgreSQL (relational data)
Redis (cache and async queues)
S3 or local media storage (user uploads, generated files)
```

The frontend bundles (JS/CSS) are generated ahead of time and referenced via the
stats manifest. Runtime interactions between browser and server use both
server‑rendered pages and JSON APIs. Storage mode and many integration points
are controlled via environment variables, which keeps local development
relatively self‑contained while still matching production architecture closely.
