from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

# Define an inline admin descriptor for UserProfile
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'
    fk_name = 'user' # Explicitly specify the foreign key name if not default

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    # You can add 'view_profile_link' if you define such a method in UserAdmin

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Optionally, register UserProfile directly if you want a separate admin page for profiles
# (might be useful for profiles not directly linked or for advanced filtering)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'location', 'interests')
# admin.site.register(UserProfile, UserProfileAdmin)
