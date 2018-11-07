from django.utils import timezone
from rest_framework import serializers
from .models import Shelter, EvacuationHistory, PersonalEvacuationHistory


def round_distance(distance: float, digit: int=-1) -> int:
    """
    10の位で丸める
    """
    p = 10 ** digit
    return (distance * p * 2 + 1) // 2 / p


class ShelterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shelter
        fields = ('name', 'address', 'lat', 'lon', 'capacity')

    def to_representation(self, instance):
        data = super(ShelterSerializer, self).to_representation(instance)
        dist_key = 'distance'
        data[dist_key] = round_distance(getattr(instance, dist_key, 0.0) * 1000)
        return data


class EvacuationHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = EvacuationHistory
        fields = ('created_at', 'count')


class PersonalEvacuationHistorySerializer(serializers.ModelSerializer):

    shelter_id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = PersonalEvacuationHistory
        fields = ('pk', 'shelter_id', 'is_evacuated')

    def create(self, validated_data):
        user = self.context['request'].user
        history, is_created = PersonalEvacuationHistory.objects.get_or_create(
            shelter_id=validated_data['shelter_id'], user=user, is_evacuated=validated_data['is_evacuated'],
            created_at=timezone.now()
        )
        if not is_created:
            raise serializers.ValidationError({'is_evacuated': 'You have already evacuate.'})
        return history
