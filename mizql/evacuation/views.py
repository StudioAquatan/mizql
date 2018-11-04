import coreapi
import coreschema
from rest_framework import viewsets, permissions, schemas
from .models import Shelter
from .serializers import ShelterSerializer


class ShelterViewSets(viewsets.ReadOnlyModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ShelterSerializer
    schema = schemas.AutoSchema(
        manual_fields=[
            coreapi.Field(
                'lat',
                required=True,
                location='query',
                schema=coreschema.String(description='latitude'),
            ),
            coreapi.Field(
                'lon',
                required=True,
                location='query',
                schema=coreschema.String(description='longitude'),
            ),
            coreapi.Field(
                'distance',
                required=True,
                location='query',
                schema=coreschema.Integer(description='radius'),
            ),
        ]
    )

    def get_queryset(self):
        params = self.request.query_params
        distance = int(params.get('distance', '1000'))
        lat = params.get('lat', None)
        lon = params.get('lon', None)
        if lat and lon:
            lat = float(lat)
            lon = float(lon)
            return Shelter.objects.get_nearby_shelters_list(lat, lon, distance)\
                .order_by('distance').all()
        return Shelter.objects.all()
