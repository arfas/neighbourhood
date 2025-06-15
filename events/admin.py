from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'location', 'creator', 'created_at', 'updated_at')
    list_filter = ('date', 'creator', 'location', 'tags')
    search_fields = ('name', 'description', 'location', 'tags')
    date_hierarchy = 'date' # Adds quick date navigation
    ordering = ('-date', '-time')

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'location', 'tags')
        }),
        ('Date and Time', {
            'fields': ('date', 'time')
        }),
        ('Ownership', {
            'fields': ('creator',) # Creator is not editable here if set by perform_create
        }),
    )
    # If creator is set in perform_create, it should be readonly in admin for existing objects
    # For new objects created in admin, admin will allow setting it.
    # To make it truly read-only for display:
    # readonly_fields = ('creator', 'created_at', 'updated_at')

    def get_readonly_fields(self, request, obj=None):
        if obj: # Editing an existing object
            return self.readonly_fields + ('creator', 'created_at', 'updated_at')
        return self.readonly_fields

    # If you want to ensure creator is set to current user when creating via admin:
    # def save_model(self, request, obj, form, change):
    #     if not obj.pk: # i.e. when creating a new object
    #         obj.creator = request.user
    #     super().save_model(request, obj, form, change)
