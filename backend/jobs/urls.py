from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, CategoryViewSet,
    JobViewSet, MyApplicationsView, update_application_status
)

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('my-applications/', MyApplicationsView.as_view()),
    path('applications/<int:pk>/status/', update_application_status),
]
