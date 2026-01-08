from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # Bu alanları Python modelinden JSON objesine çevir.
        fields = ['id', 'title', 'description', 'is_completed', 'created_at'] 