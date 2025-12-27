from rest_framework import serializers
from .models import SiteSettings, Sponsor, SocialLink
from django.conf import settings
import cloudinary


class SiteSettingsSerializer(serializers.ModelSerializer):
    club_logo = serializers.SerializerMethodField()
    university_logo = serializers.SerializerMethodField()
    hero_background = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSettings
        fields = ['id', 'club_name', 'club_full_name', 'club_motto', 'club_logo', 'university_logo', 'hero_background', 'updated_at']
    
    def _get_cloudinary_url(self, image_field):
        """Convert image field to Cloudinary URL"""
        if not image_field:
            return None
        
        # If already a Cloudinary URL, return it
        if 'cloudinary.com' in str(image_field.url):
            return image_field.url
        
        # Otherwise, construct Cloudinary URL from the name
        if image_field.name:
            # Build Cloudinary URL
            cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
            # Remove any 'media/' prefix if it exists
            public_id = image_field.name.replace('media/', '', 1) if image_field.name.startswith('media/') else image_field.name
            return f"https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}"
        
        return None
    
    def get_club_logo(self, obj):
        return self._get_cloudinary_url(obj.club_logo)
    
    def get_university_logo(self, obj):
        return self._get_cloudinary_url(obj.university_logo)
    
    def get_hero_background(self, obj):
        return self._get_cloudinary_url(obj.hero_background)


class SponsorSerializer(serializers.ModelSerializer):
    collaboration_date_formatted = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    
    class Meta:
        model = Sponsor
        fields = [
            'id', 'name', 'logo', 'website', 'collaboration_agenda', 
            'collaboration_date', 'collaboration_date_formatted', 'is_active', 'order'
        ]
    
    def get_collaboration_date_formatted(self, obj):
        return obj.collaboration_date.strftime('%B %Y')
    
    def _get_cloudinary_url(self, image_field):
        """Convert image field to Cloudinary URL"""
        if not image_field:
            return None
        
        # If already a Cloudinary URL, return it
        if 'cloudinary.com' in str(image_field.url):
            return image_field.url
        
        # Otherwise, construct Cloudinary URL from the name
        if image_field.name:
            cloud_name = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
            # Remove any 'media/' prefix if it exists
            public_id = image_field.name.replace('media/', '', 1) if image_field.name.startswith('media/') else image_field.name
            return f"https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}"
        
        return None
    
    def get_logo(self, obj):
        return self._get_cloudinary_url(obj.logo)


class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'platform_display', 'url', 'icon_class', 'is_active', 'order']
