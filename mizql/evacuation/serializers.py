from rest_framework import serializers
from .models import Shelter


def round_distance(distance: float, digit: int=-1) -> int:
    """
    10の位で丸める
    """
    p = 10 ** digit
    return (distance * p * 2 + 1) // 2 / p


class ShelterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shelter
        fields = ('name', 'address', 'lat', 'lon')

    def to_representation(self, instance):
        data = super(ShelterSerializer, self).to_representation(instance)
        dist_key = 'distance'
        data[dist_key] = round_distance(getattr(instance, dist_key, 0.0) * 1000)
        return data
