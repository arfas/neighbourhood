from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet

app_name = 'events'

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event') # r'events' will be the path prefix for this viewset

urlpatterns = [
    path('', include(router.urls)), # This will generate URLs like /api/events/, /api/events/{id}/ etc.
]
