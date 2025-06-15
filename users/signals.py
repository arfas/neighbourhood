from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # This ensures the profile is saved whenever the User object is saved.
    # The get_or_create handles cases where a profile might not exist yet,
    # though create_user_profile should handle the initial creation.
    profile, created = UserProfile.objects.get_or_create(user=instance)
    if not created: # Only save if it already existed and might need an update based on user model (if any fields were mapped)
        profile.save() # Or more specific field updates if needed. For now, just saving.
