from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from django.db import connection

from groq import Groq
from decouple import config

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


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def ai_breakdown(request):
    main_task = request.data.get('task_title', '')

    if not main_task:
        return Response({"error": "Görev başlığı boş olamaz!"}, status=400)

    try:
        client = Groq(
            api_key=config('GROQ_API_KEY'), 
        )
    except Exception as e:
        return Response({"error": "API Anahtarı hatası: " + str(e)}, status=500)

    # ZAFİYET: main_task hiçbir filtreleme olmadan prompt'a giriyor.
    system_instruction = "Sen yardımcı bir asistanısn. Verilen görevi gerçekleştirmek için 7 kısa, uygulanabilir alt adım listele. Sadece maddeleri yaz, giriş cümlesi kurma."
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_instruction
                },
                {
                    "role": "user",
                    "content": f"Görev: {main_task}",
                }
            ],
            model="llama-3.1-8b-instant",
        )

        # 4. Gelen Cevabı İşle
        content = chat_completion.choices[0].message.content
        raw_lines = content.split('\n')
        
        subtasks = []

        for line in raw_lines:
            cleaned_line = line.strip()
            if cleaned_line:
                subtasks.append(cleaned_line)

        return Response({"subtasks": subtasks})

    except Exception as e:
        return Response({"error": "AI Servis Hatası: " + str(e)}, status=500)
    

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def unsafe_search(request):
    query = request.GET.get('query', '')

    # --- ZAFİYET BURADA ---
    sql_query = f"SELECT * FROM api_task WHERE title LIKE '%{query}%'"

    with connection.cursor() as cursor:
        cursor.execute(sql_query)
        rows = cursor.fetchall()
    
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "is_completed": bool(row[3]),
        })

    return Response(results)