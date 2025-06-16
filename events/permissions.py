from rest_framework import permissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Read-only access is allowed for any request (authenticated or not).
    - Create (POST) access is allowed for authenticated users.
    - Update/Delete (PUT, PATCH, DELETE) access is only allowed to the creator of the object.
    """

    def has_permission(self, request, view):
        # Allow read-only for any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow POST (create) for authenticated users only
        # For other methods like PUT, PATCH, DELETE on a specific object,
        # this method is still called first for general view permission.
        # If it passes, then has_object_permission is called.
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request (GET, HEAD, OPTIONS)
        # This is re-checked here for object-level views, but is generally redundant
        # if has_permission already allowed SAFE_METHODS.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions (PUT, PATCH, DELETE) are only allowed to the creator of the event.
        # Assumes the object 'obj' has a 'creator' attribute.
        if not request.user or not request.user.is_authenticated:
            return False # Should not happen if has_permission is properly checked by DRF first for non-safe methods

        return obj.creator == request.user
