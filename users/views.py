from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, UserDetailSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all() # Required for RetrieveUpdateAPIView
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensure a profile exists for the user, which signals should handle.
        # If it might not (e.g., user created before signals were active),
        # use get_or_create.
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

# For retrieving user details (including profile), you might want a separate view
# or adjust UserProfileView if it were to handle User model.
# For now, UserDetailSerializer can be used by another view if needed, e.g., a UserDetailView.
# The current UserProfileView is specifically for managing the UserProfile instance.

# Login view (obtain_auth_token) will be added in urls.py directly.
