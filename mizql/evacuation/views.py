from rest_framework import viewsets, permissions
from .models import Shelter
from .serializers import ShelterSerializer


class ShelterViewSets(viewsets.ReadOnlyModelViewSet):

    queryset = Shelter.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShelterSerializer
