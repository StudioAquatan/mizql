from django.contrib import admin
from .models import Shelter, EvacuationHistory, PersonalEvacuationHistory


@admin.register(Shelter)
class ShelterAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'lat', 'lon')


@admin.register(EvacuationHistory)
class EvacuationHistoryAdmin(admin.ModelAdmin):
    list_display = ('shelter_name', 'count', 'created_at')

    def shelter_name(self, obj):
        return obj.shelter.name


@admin.register(PersonalEvacuationHistory)
class PersonalEvacuationHistoryAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'shelter_name', 'is_evacuated', 'created_at')

    def user_name(self, obj):
        return obj.user.username

    def shelter_name(self, obj):
        return obj.shelter.name
