from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Event
from .serializers import EventSerializer
from .permissions import IsCreatorOrReadOnly # Import custom permission

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    Supports filtering by location and tags.
    - Query by location: /api/events/?location=CityName
    - Query by tags (comma-separated): /api/events/?tags=python,django
    - Combined: /api/events/?location=CityName&tags=react
    """
    serializer_class = EventSerializer
    permission_classes = [IsCreatorOrReadOnly] # Use custom permission

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    def get_queryset(self):
        """
        Optionally restricts the returned events by filtering against
        a `location` and/or `tags` query parameter in the URL.
        """
        # Default ordering is defined in Event.Meta, so Event.objects.all() will use it.
        queryset = Event.objects.all()

        location = self.request.query_params.get('location', None)
        tags_query = self.request.query_params.get('tags', None)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if tags_query:
            tags_list = [tag.strip() for tag in tags_query.split(',') if tag.strip()]
            if tags_list:
                # Build a Q object to match events containing ANY of the provided tags.
                # This assumes Event.tags is a comma-separated string field.
                # For each tag in tags_list, we create a Q(tags__icontains=tag_item).
                # These Q objects are then combined with the OR operator.

                # Individual Q objects for each tag
                tag_q_objects = [Q(tags__icontains=tag_item) for tag_item in tags_list]

                # Combine all Q objects using OR
                # Start with the first Q object, then OR the rest.
                if tag_q_objects:
                    combined_tag_query = tag_q_objects[0]
                    for i in range(1, len(tag_q_objects)):
                        combined_tag_query |= tag_q_objects[i]

                    queryset = queryset.filter(combined_tag_query)

        return queryset

    def perform_create(self, serializer):
        """
        Automatically set the creator of the event to the current logged-in user.
        """
        serializer.save(creator=self.request.user)

    # Add object-level permissions later if needed (e.g., IsOwnerOrReadOnly)
    # def get_permissions(self):
    #     if self.action in ['update', 'partial_update', 'destroy']:
    #         # Example: self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnlyCustom]
    #         pass
    #     return super().get_permissions()
