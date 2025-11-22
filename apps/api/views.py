"""Public API views for token management and base API behavior.

Important endpoints:
- `TokenObtainView`: obtain an access token using user credentials.
- `TokenRevokeView`: revoke an existing token.

These views are intentionally minimal and rely on serializers for the
core logic. Exceptions are normalized via `ApiErrorsMixin`.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers
from .errors import InvalidToken, TokenError
from .mixins import ApiErrorsMixin


class TokenViewBase(APIView):
    """Base view for token operations.

    Subclasses must define `serializer_class` that validates `request.data` and
    returns a payload for the response in `validated_data`.
    """
    permission_classes = ()
    authentication_classes = ()

    serializer_class = None

    def post(self, request, *args, **kwargs):
        """Validate request data with the configured serializer and respond.

        Returns HTTP 200 with the serializer's `validated_data` on success or
        raises `InvalidToken` if serializer validation signals a `TokenError`.
        """
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class TokenObtainView(TokenViewBase):
    """
    Takes a set of user credentials and returns an access token
    to prove the authentication of those credentials.
    """
    serializer_class = serializers.TokenObtainSerializer


class TokenRevokeView(TokenViewBase):
    """Revoke an existing access token."""
    serializer_class = serializers.TokenRevokeSerializer


class APIBaseView(ApiErrorsMixin, APIView):
    """Base class for API views that normalizes common API errors."""
    pass
