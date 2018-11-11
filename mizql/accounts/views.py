from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from rest_framework import viewsets, mixins, permissions, generics
from . import models, serializers, permissions as custom_permissions
from .forms import LoginForm


class Login(LoginView):
    """ログインページ"""
    form_class = LoginForm
    template_name = 'accounts/login.html'


class Logout(LoginRequiredMixin, LogoutView):
    """ログアウトページ"""
    template_name = 'accounts/top.html'


class UserViewSets(mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin,
                   viewsets.GenericViewSet):

    """
    retrieve:
        指定したユーザのプロフィールを取得するエンドポイント
    create:
        ユーザを作成するエンドポイント．未認証のユーザでも叩ける．
    """
    queryset = models.User.objects.all()
    permission_classes = (permissions.IsAuthenticated, custom_permissions.IsOwnerOrReadOnly)

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.AllowAny]
        return super(UserViewSets, self).get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.CreateUserSerializer
        return serializers.UserSerializer


class MeView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
