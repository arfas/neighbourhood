from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    # To display username instead of ID for creator in API responses (read-only)
    creator_username = serializers.CharField(source='creator.username', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'description',
            'date',
            'time',
            'location',
            'creator',  # Keep this for writing (will be set in view)
            'creator_username', # Read-only username display
            'tags',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['creator'] # 'creator' field itself is read-only in input, set by view

    def validate(self, data):
        # Add any custom validation if needed.
        # For example, ensure date is not in the past for new events.
        return data
