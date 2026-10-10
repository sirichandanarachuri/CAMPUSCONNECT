from django.urls import path

from apps.accounts.views import AuthViewSet

urlpatterns = [
    path("register/", AuthViewSet.as_view({"post": "register"}), name="register"),
    path("login/", AuthViewSet.as_view({"post": "login"}), name="login"),
    path("logout/", AuthViewSet.as_view({"post": "logout"}), name="logout"),
    path("me/", AuthViewSet.as_view({"get": "current_user"}), name="current-user"),
    path("roles/", AuthViewSet.as_view({"get": "roles"}), name="roles"),
]

