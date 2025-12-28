from rest_framework import serializers
from .models import SiteSettings, Sponsor, SocialLink, Class, Resource


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ['id', 'club_name', 'club_full_name', 'club_motto', 'club_logo', 'university_logo', 'hero_background', 'updated_at']


class SponsorSerializer(serializers.ModelSerializer):
    collaboration_date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Sponsor
        fields = [
            'id', 'name', 'logo', 'website', 'collaboration_agenda', 
            'collaboration_date', 'collaboration_date_formatted', 'is_active', 'order'
        ]
    
    def get_collaboration_date_formatted(self, obj):
        return obj.collaboration_date.strftime('%B %Y')


class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'platform_display', 'url', 'icon_class', 'is_active', 'order']


class ClassSerializer(serializers.ModelSerializer):
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    status_display = serializers.SerializerMethodField()
    mode = serializers.ReadOnlyField()
    mode_display = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_joinable = serializers.ReadOnlyField()
    start_date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Class
        fields = [
            'id', 'title', 'description', 'instructor', 'difficulty', 'difficulty_display',
            'status', 'status_display', 'mode', 'mode_display', 'thumbnail', 'start_date', 'start_date_formatted',
            'end_date', 'duration', 'max_participants', 'enrolled_count', 'is_full', 'is_joinable',
            'meeting_link', 'location', 'syllabus', 'is_active', 'order',
            'created_at', 'updated_at'
        ]
    
    def get_status_display(self, obj):
        """Return computed status display based on time"""
        return obj.computed_status_display
    
    def get_start_date_formatted(self, obj):
        """Format start date in IST timezone"""
        from django.utils import timezone
        from zoneinfo import ZoneInfo
        
        start_date = obj.start_date
        
        # If naive datetime, make it aware
        if start_date.tzinfo is None:
            start_date = timezone.make_aware(start_date)
        
        # Convert to IST timezone
        ist = ZoneInfo('Asia/Kolkata')
        start_date_ist = start_date.astimezone(ist)
        
        # Format: "December 28, 2025 at 02:30 PM"
        return start_date_ist.strftime('%B %d, %Y at %I:%M %p')


class ResourceSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    tag_list = serializers.ReadOnlyField()
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'category', 'category_display', 'thumbnail',
            'file', 'external_link', 'author', 'tags', 'tag_list', 'is_featured',
            'is_active', 'download_count', 'order',
            'created_at', 'updated_at'
        ]
