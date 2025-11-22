 # apps/api — DRF utilities and auth tokens

 Purpose
 - Encapsulates common building blocks for the public API based on Django REST Framework: token issuance, base serializers/pagination/permissions, error handling, and helper mixins.

 Layout
 - __init__.py — package marker.
 - apps.py — Django app config.
 - urls.py — public API routes of this package (token endpoints and service routes).
 - views.py — DRF views (e.g., obtain/revoke token, etc.).
 - serializers.py — serializers used by the views.
 - permissions.py — shared DRF permissions for the API.
 - pagination.py — base pagination classes for the API.
 - authentication.py — token authentication (DRF/JWT or custom token model).
 - models.py — token/log models (minimal API entities).
 - mixins.py, utils.py, services.py — helper abstractions and thin domain logic.
 - errors.py — common API exceptions/error codes.
 - settings.py — local API‑level settings/constants.
 - migrations/ — database migrations for API models.
 - tests/ — API tests (e.g., test_api_obtain_token.py).

 Entry points
 - urls.py → views.py (APIView/GenericAPIView). Main endpoints: obtain/refresh/revoke token.
 - authentication.py — wired via DRF AUTHENTICATION_CLASSES.

 Relations
 - Reused across other apps to standardize API behavior (permissions, pagination, errors).

 Patterns
 - “Thin” views + serializers; business logic isolated in services.py.

 Tests and i18n
 - tests/ contains endpoint integration tests.
 - Strings are localized via project‑level locale/*.
