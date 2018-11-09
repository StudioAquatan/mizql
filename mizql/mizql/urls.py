"""mizql URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
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
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from rest_framework_swagger.views import get_swagger_view

from accounts.views import UserViewSets, MeView
from evacuation.views import ShelterViewSets, EvacuationHistoryViewSets, EvacuationViewSets, DemoEvacuationHistoryViewSets
from disaster.views import LocationView, DemoLocationView

router = DefaultRouter()
router.register(r'users', UserViewSets, basename='users')
router.register(r'shelters', ShelterViewSets, basename='shelters')
router.register(r'demo-shelters', ShelterViewSets, basename='demo-shelters')

shelter_nested_router = NestedDefaultRouter(router, 'shelters', lookup='shelter')
shelter_nested_router.register(r'history', EvacuationHistoryViewSets, basename='history')
shelter_nested_router.register(r'evacuate', EvacuationViewSets, basename='evacuate')

demo_shelter_nested_serializer = NestedDefaultRouter(router, 'demo-shelters', lookup='shelter')
demo_shelter_nested_serializer.register('history', DemoEvacuationHistoryViewSets, basename='history')

if not settings.DEBUG:
    url = '/api/'
else:
    url = None

urlpatterns = [
    path('admin/', admin.site.urls),
    path('_/', include('accounts.urls')),
    path('users/me/', MeView.as_view()),
    path('', include(router.urls)),
    path('', include(shelter_nested_router.urls)),
    path('', include(demo_shelter_nested_serializer.urls)),
    path('area/', LocationView.as_view()),
    path('demo-area/', DemoLocationView.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('swagger/', get_swagger_view(title='mizql API Doc', url=url)),
]
