from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class UserInline(admin.StackedInline):
    model = User.follows.through
    fk_name = 'from_user'
    extra = 1


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'created_at')
    fieldsets = (
        (None, {'fields': ('username', 'first_name', 'last_name', 'email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    ordering = ['-created_at']
    inlines = [UserInline]
