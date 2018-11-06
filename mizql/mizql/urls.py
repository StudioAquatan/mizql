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
from rest_framework.routers import DefaultRouter
from rest_framework_swagger.views import get_swagger_view

from accounts.views import UserViewSets
from evacuation.views import ShelterViewSets
from disaster.views import LocationView, DemoLocationView

router = DefaultRouter()
router.register(r'users', UserViewSets, basename='users')
router.register(r'shelters', ShelterViewSets, basename='shelters')

if not settings.DEBUG:
    url = '/api/'
else:
    url = None

urlpatterns = [
    path('admin/', admin.site.urls),
    path('_/', include('accounts.urls')),
    path('', include(router.urls)),
    path('area/', LocationView.as_view()),
    path('demo-area/', DemoLocationView.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('swagger/', get_swagger_view(title='mizql API Doc', url=url)),
]
