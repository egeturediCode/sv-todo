from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, login_api, ai_breakdown

router = DefaultRouter()
router.register(r'todos', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_api, name='api_login'),
    path('ai-analyze/', ai_breakdown, name='ai_breakdown'),
]