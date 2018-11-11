from rest_framework import serializers
from .models import User
from evacuation.serializers import PersonalEvacuationHistorySerializer


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class UserSerializer(serializers.ModelSerializer):

    follows = RecursiveField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'created_at', 'updated_at', 'follows')

    def to_representation(self, instance):
        data = super(UserSerializer, self).to_representation(instance)
        latest = instance.evacuation_histories.order_by('-created_at').first()
        serializer = PersonalEvacuationHistorySerializer(latest, allow_null=True)
        data['evacuation_status'] = serializer.data
        data['username'] = instance.name
        return data


class CreateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
