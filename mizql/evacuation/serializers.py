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
        fields = ('pk', 'name', 'address', 'lat', 'lon', 'capacity')

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

    shelter = ShelterSerializer(read_only=True, allow_null=True)

    class Meta:
        model = PersonalEvacuationHistory
        fields = ('pk', 'shelter', 'is_evacuated')

    def to_internal_value(self, data):
        return {
            'is_evacuated': data['is_evacuated'],
            'shelter_id': data['shelter_id'],
        }

    def create(self, validated_data):
        shelter_id = validated_data['shelter_id']
        is_evacuated = validated_data['is_evacuated']
        user = self.context['request'].user
        user_histories = PersonalEvacuationHistory.objects.filter(user=user).order_by('-created_at').all()
        evacuated = [h for h in user_histories if h.is_evacuated]
        if len(evacuated) > 0:
            if is_evacuated:
                raise serializers.ValidationError({'is_evacuated': 'You have already evacuate.'})
            for e in evacuated:
                e.is_evacuated = False
                e.save()
            return evacuated[0]
        return PersonalEvacuationHistory.objects.create(
            shelter_id=shelter_id, user=user, is_evacuated=is_evacuated, created_at=timezone.now()
        )
