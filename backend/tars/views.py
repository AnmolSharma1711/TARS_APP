from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.utils import timezone


@api_view(['GET'])
def root(request):
    """
    Root endpoint - API welcome message
    """
    return Response({
        'message': 'Welcome to TARS Club API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'info': '/api/info/',
            'home': '/api/home/',
            'admin': '/admin/',
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
            },
            'data': {
                'site_settings': '/api/site-settings/',
                'sponsors': '/api/sponsors/',
                'social_links': '/api/social-links/',
            }
        }
    })


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint that verifies:
    - API is running
    - Database connection is working
    - Returns current timestamp
    """
    health_status = {
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'service': 'TARS Backend API',
        'database': 'disconnected'
    }
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_status['database'] = 'connected'
    except Exception as e:
        health_status['status'] = 'unhealthy'
        health_status['database'] = f'error: {str(e)}'
        return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    return Response(health_status, status=status.HTTP_200_OK)


@api_view(['GET'])
def api_info(request):
    """
    API information endpoint
    """
    return Response({
        'name': 'TARS Club Website API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'admin': '/admin/',
            'info': '/api/info/'
        }
    })
