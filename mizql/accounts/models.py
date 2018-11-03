from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    """
    カスタムユーザモデルのためのマネージャ
    """

    def create_user(self, username, password, **extra_fields):
        """
        ユーザ作成の関数
        :param username: ユーザ名 *必須*
        :param password: パスワード
        :param email: メールアドレス
        :param extra_fields: その他のパラメータ
        :return: 作成されたユーザのManagerインスタンス
        """
        if 'email' in extra_fields.keys():
            extra_fields['email'] = self.normalize_email(extra_fields['email'])
        user = self.model(
            username=username,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, username, password, **kwargs):
        """
        /adminにログインできるスーパーユーザ作成用の関数
        :param username: ユーザ名 *必須*
        :param password: パスワード
        :return: 作成されたStudentのインスタンス
        """
        return self.create_user(username=username, password=password, is_staff=True,
                                is_superuser=True, is_active=True, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    """
    ユーザのモデル
    """
    username = models.CharField(verbose_name='ユーザ名', max_length=100, unique=True)
    email = models.EmailField(max_length=255, unique=False, default='hoge@fuga.com')
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField('登録日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)

    USERNAME_FIELD = 'username'

    objects = UserManager()

    def __str__(self):
        """ユーザ名を返却"""
        return self.email

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'ユーザ'
        verbose_name_plural = 'ユーザ'
