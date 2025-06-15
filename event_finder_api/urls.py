from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/', include('events.urls')),     # For EventViewSet router, will create /api/events/
    path('api-auth/', include('rest_framework.urls')), # For browsable API login
]
