from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255, help_text="e.g., Venue Name, City, Country")
    creator = models.ForeignKey(User, related_name='created_events', on_delete=models.CASCADE)
    tags = models.TextField(blank=True, help_text="Comma-separated list of tags or interests relevant to the event")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-date', '-time'] # Default ordering for queries
