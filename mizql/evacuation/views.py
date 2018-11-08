import coreapi
import coreschema
from datetime import timedelta, datetime
from django.utils import timezone
from django.shortcuts import get_object_or_404
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

    def _create_histories(self, shelter_id: int, remaining: int, offset: int, latest: datetime):
        for i in range(remaining):
            since = latest + timedelta(minutes=10*i)
            until = latest + timedelta(minutes=10*(i+1))
            current = PersonalEvacuationHistory.objects.filter(shelter_id=shelter_id, created_at__range=[since, until])
            stay = current.filter(is_evacuated=True).all().count()
            gohome = current.filter(is_evacuated=False).all().count()
            offset = offset + stay - gohome
            hist = EvacuationHistory(
                shelter_id=shelter_id, count=offset, created_at=until, is_demo=False
            )
            hist.save()

    def list(self, request, *args, **kwargs):
        shelter_id = int(kwargs['shelter_pk'])
        now = timezone.now()
        since = now - timedelta(minutes=10*10)
        queryset = self.get_queryset().filter(
            shelter_id=shelter_id, is_demo=False, created_at__gte=since
        ).order_by('-created_at').all()
        if queryset.count() >= 10:
            queryset = queryset[:10]
        else:
            # 存在するHistoryで最新の物を取得
            latest = queryset.first()
            if latest is not None:
                # 現在時刻との差分がいくつあるか（10分おきのデータを作るので10で割る）
                remaining = (now - latest.created_at).seconds // 60 // 10
                offset = latest.count
                init = latest.created_at
            else:
                remaining = 10
                latest = self.get_queryset().filter(shelter_id=shelter_id, is_demo=False)\
                    .order_by('-created_at').first()
                offset = latest.count if latest is not None else 0
                init = now - timedelta(minutes=now.minute % 10 + 10*9, seconds=now.second, microseconds=now.microsecond)
            self._create_histories(shelter_id, remaining, offset, init)
            # 再取得
            queryset = self.get_queryset().filter(
                shelter_id=shelter_id, is_demo=False, created_at__gte=since
            ).order_by('-created_at').all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DemoEvacuationHistoryViewSets(EvacuationHistoryViewSets):

    def list(self, request, *args, **kwargs):
        shelter_id = int(kwargs['shelter_pk'])
        queryset = self.get_queryset().filter(shelter_id=shelter_id, is_demo=True)[:10]
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
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
