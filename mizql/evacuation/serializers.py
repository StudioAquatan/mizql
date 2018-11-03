from rest_framework import serializers


class ShelterSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('name', 'address', 'lat', 'lon')
