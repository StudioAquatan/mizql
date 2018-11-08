from datetime import timedelta
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


class EvacuationHistoryListSerializer(serializers.ListSerializer):

    def to_representation(self, instances):
        resp = [self.child.to_representation(instance) for instance in instances]
        latest = instances[0].created_at
        shelter = instances[0].shelter
        previous_count = instances[0].count
        current = PersonalEvacuationHistory.objects.filter(shelter=shelter, created_at__gt=latest).all()
        stay = current.filter(is_evacuated=True).all().count()
        gohome = current.filter(is_evacuated=False).all().count()
        d_f = serializers.DateTimeField()
        resp.insert(0, {'created_at': d_f.to_representation(timezone.now()), 'count': stay - gohome + previous_count})
        return resp


class EvacuationHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = EvacuationHistory
        fields = ('created_at', 'count')
        list_serializer_class = EvacuationHistoryListSerializer


class DemoEvacuationHistoryListSerializer(EvacuationHistoryListSerializer):

    def to_representation(self, instances):
        # デモ用に突っ込んだ時間のデータを現在の時間に置換
        data = super(DemoEvacuationHistoryListSerializer, self).to_representation(instances)
        current = data[0]['created_at']
        latest = current - timedelta(
            minutes=current.minute % 10, seconds=current.second, microseconds=current.microsecond
        )
        d_f = serializers.DateTimeField()
        for i in range(1, len(data)-1):
            data[i]['created_at'] = d_f.to_representation(latest - timedelta(minutes=10*(i-1)))
        return data


class DemoEvacuationHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = EvacuationHistory
        fields = ('created_at', 'count')
        list_serializer_class = DemoEvacuationHistoryListSerializer


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
        now = timezone.now().astimezone(timezone.get_default_timezone())
        return PersonalEvacuationHistory.objects.create(
            shelter_id=shelter_id, user=user, is_evacuated=is_evacuated, created_at=now
        )
