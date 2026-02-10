
from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(read_only=True)

    

    class Meta:

        model = User

        fields = [

            'id', 'email', 'first_name', 'last_name', 'full_name',

            'phone', 'profile_picture', 'role', 'is_active', 'is_staff',

            'is_superuser', 'date_joined'

        ]

        read_only_fields = ['id', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):

    password_confirm = serializers.CharField(write_only=True)

    

    class Meta:

        model = User

        fields = [

            'email', 'password', 'password_confirm',

            'first_name', 'last_name', 'phone', 'role'

        ]

        extra_kwargs = {

            'password': {'write_only': True}

        }

    

    def validate(self, data):

        if data['password'] != data['password_confirm']:

            raise serializers.ValidationError("Passwords don't match")

        return data

    

    def create(self, validated_data):

        validated_data.pop('password_confirm')

        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)

        return user

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)

class ProfilePictureUploadSerializer(serializers.Serializer):

    profile_picture = serializers.ImageField()

