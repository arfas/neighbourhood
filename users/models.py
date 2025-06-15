from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    interests = models.TextField(blank=True, help_text="Comma-separated list of interests")
    location = models.CharField(max_length=255, blank=True, help_text="e.g., City, Country")

    def __str__(self):
        return f"{self.user.username}'s Profile"
