import coreapi
import coreschema
from rest_framework import viewsets, permissions, schemas, mixins, status
from rest_framework.response import Response
from .models import Shelter, EvacuationHistory, PersonalEvacuationHistory
from .serializers import ShelterSerializer, EvacuationHistorySerializer, PersonalEvacuationHistorySerializer


class ShelterViewSets(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
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
                required=False,
                location='query',
                schema=coreschema.Integer(description='radius'),
                description='Default is 1000'
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
            if self.action == 'list':
                return Shelter.objects.get_nearby_shelters_list(lat, lon, distance) \
                    .order_by('distance').all()
            return Shelter.objects.with_distance(lat, lon).all()
        return Shelter.objects.all()


class EvacuationHistoryViewSets(mixins.ListModelMixin,
                                viewsets.GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = EvacuationHistory.objects.all()
    serializer_class = EvacuationHistorySerializer

    def list(self, request, *args, **kwargs):
        shelter_id = int(kwargs['shelter_pk'])
        queryset = self.get_queryset().filter(shelter_id=shelter_id)[:10]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EvacuationViewSets(mixins.CreateModelMixin,
                         viewsets.GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = PersonalEvacuationHistory.objects.all()
    serializer_class = PersonalEvacuationHistorySerializer

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated]
        return super(EvacuationViewSets, self).get_permissions()

    def create(self, request, *args, **kwargs):
        shelter_id = int(kwargs['shelter_pk'])
        data = request.data
        data['shelter_id'] = shelter_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
