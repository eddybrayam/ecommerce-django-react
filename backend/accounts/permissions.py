from rest_framework.permissions import BasePermission

class IsInGroup(BasePermission):
    group_name = None
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and self.group_name
            and request.user.groups.filter(name=self.group_name).exists()
        )

class IsAdminRole(IsInGroup):
    group_name = "ADMIN"

class IsVendorRole(IsInGroup):
    group_name = "VENDOR"

class IsClientRole(IsInGroup):
    group_name = "CLIENT"
