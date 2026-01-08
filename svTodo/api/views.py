from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        # IDOR önleme
        # Sadece giriş yapan kullanıcının kendi görevlerini getirir.
        # Eğer giriş yapmamışsa hata vermesin diye boş liste döndürürüz.
        user = self.request.user
        if user.is_authenticated:
            return Task.objects.filter(owner=user)
        return Task.objects.none()
    
    def perform_create(self, serializer): # override perform_create to set owner!
        serializer.save(owner=self.request.user)

@api_view(['POST'])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'})
    return Response({'message': 'Invalid credentials'}, status=401)