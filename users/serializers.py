from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['interests', 'location']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False, allow_null=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile']
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False}
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user( # use create_user to handle password hashing
            username=validated_data['username'],
            email=validated_data.get('email', ''), # Ensure email is handled
            password=validated_data['password']
        )
        # UserProfile is automatically created by signals now.
        # If profile_data is provided, update the newly created profile.
        if profile_data:
            profile = user.profile # Access the profile created by the signal
            profile.interests = profile_data.get('interests', profile.interests)
            profile.location = profile_data.get('location', profile.location)
            profile.save()
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
