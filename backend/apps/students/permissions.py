from rest_framework.permissions import BasePermission


class IsStudentOwner(BasePermission):
    message = "Only the owner student can access this resource."

    def has_object_permission(self, request, view, obj):
        return hasattr(obj, "student") and getattr(obj.student, "user", None) == request.user

