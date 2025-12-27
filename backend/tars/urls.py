"""
URL configuration for tars project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from . import views
from . import auth_views
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import SiteSettingsViewSet, SponsorViewSet, SocialLinkViewSet, home_page_data

# Create router for viewsets
router = DefaultRouter()
router.register(r'site-settings', SiteSettingsViewSet)
router.register(r'sponsors', SponsorViewSet)
router.register(r'social-links', SocialLinkViewSet)

# Customize admin site headers
admin.site.site_header = "TARS Club Administration"
admin.site.site_title = "TARS Admin Portal"
admin.site.index_title = "Welcome to TARS Club Management"

urlpatterns = [
    # Root endpoint
    path("", views.root, name="root"),
    
    # Admin
    path("admin/", admin.site.urls),
    
    # Health & Info
    path("api/health/", views.health_check, name="health_check"),
    path("api/info/", views.api_info, name="api_info"),
    
    # Home page data
    path("api/home/", home_page_data, name="home_page_data"),
    
    # API router (includes site-settings, sponsors, social-links)
    path("api/", include(router.urls)),
    
    # Authentication
    path("api/auth/register/", auth_views.register, name="register"),
    path("api/auth/login/", auth_views.login, name="login"),
    path("api/auth/logout/", auth_views.logout, name="logout"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    # User Profile
    path("api/auth/profile/", auth_views.user_profile, name="user_profile"),
    path("api/auth/profile/update/", auth_views.update_profile, name="update_profile"),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
