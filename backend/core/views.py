from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import SiteSettings, Sponsor, SocialLink
from .serializers import SiteSettingsSerializer, SponsorSerializer, SocialLinkSerializer


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only view for site settings"""
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]


class SponsorViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only view for sponsors"""
    queryset = Sponsor.objects.filter(is_active=True)
    serializer_class = SponsorSerializer
    permission_classes = [AllowAny]


class SocialLinkViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only view for social links"""
    queryset = SocialLink.objects.filter(is_active=True)
    serializer_class = SocialLinkSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def home_page_data(request):
    """
    Single endpoint to get all home page data
    """
    # Get site settings (should be only one)
    site_settings = SiteSettings.objects.first()
    
    # Get active sponsors
    sponsors = Sponsor.objects.filter(is_active=True)
    
    # Get active social links
    social_links = SocialLink.objects.filter(is_active=True)
    
    return Response({
        'site_settings': SiteSettingsSerializer(site_settings, context={'request': request}).data if site_settings else None,
        'sponsors': SponsorSerializer(sponsors, many=True, context={'request': request}).data,
        'social_links': SocialLinkSerializer(social_links, context={'request': request}).data,
    })

