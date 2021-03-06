import coreapi
import coreschema
from datetime import datetime
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.schemas import ManualSchema

from .models import DemoLocation, DemoAlarm
from .serializers import LocationSerializer, DemoLocationSerializer
from .info import DisasterReport, RainReporter


class LocationView(generics.RetrieveAPIView):
    """
    地域の情報を取得するエンドポイント
    """
    serializer_class = LocationSerializer
    permission_classes = (permissions.AllowAny,)
    schema = ManualSchema([
        coreapi.Field(
            'lat', required=True, location='query', schema=coreschema.String(description='latitude'),
            example='35.048900', description='緯度'
        ),
        coreapi.Field(
            'lon', required=True, location='query', schema=coreschema.String(description='longitude'),
            example='135.780418', description='経度'
        ),
    ])

    def retrieve(self, request, *args, **kwargs):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        if lat is None or lon is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_object(self):
        """クエリパラメータから緯度経度取得して情報を返す"""
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        reporter = DisasterReport(lat, lon)
        loc = reporter.get_area_info()
        rain_reporter = RainReporter(lat, lon)
        rain_reporter.get_report(loc)
        return loc


class DemoLocationView(generics.RetrieveAPIView):
    """
    デモの情報を返す
    """
    serializer_class = DemoLocationSerializer
    permission_classes = (permissions.AllowAny,)
    schema = ManualSchema([
        coreapi.Field(
            'lat', required=True, location='query', schema=coreschema.String(description='latitude'),
            description='35.048900'
        ),
        coreapi.Field(
            'lon', required=True, location='query', schema=coreschema.String(description='longitude'),
            description='135.780418'
        ),
        coreapi.Field(
            'date', required=False, location='query', schema=coreschema.String(description='%Y-%m-%d_%H:%M%S'),
            description='2018-09-04_12:00:00'
        )
    ])

    def retrieve(self, request, *args, **kwargs):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        if lat is None or lon is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_object(self):
        """クエリパラメータから緯度経度取得して情報を返す"""
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')
        d_str = self.request.query_params.get('date')
        reporter = DisasterReport(lat, lon)
        reporter.location_class = DemoLocation
        reporter.alarm_class = DemoAlarm
        if d_str is None:
            d_str = '2018-09-04_12:00:00+0900'
        else:
            d_str = d_str + '+0900'
        loc = reporter.get_area_info(datetime.strptime(d_str, "%Y-%m-%d_%H:%M:%S%z"))
        return loc

