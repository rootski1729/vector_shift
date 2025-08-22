from django.db import models
from core.models import ModuleModel
from utils.nanoid_utils import default_nanoid
from .enums import PluginProvider, PluginService


class Plugin(ModuleModel):
    uid = models.CharField(
        max_length=21,
        unique=True,
        editable=False,
        default=default_nanoid,
        db_index=True,
    )
    provider = models.CharField(
        max_length=255, choices=[(tag, tag.value) for tag in PluginProvider]
    )
    service = models.CharField(
        max_length=255, choices=[(tag, tag.value) for tag in PluginService]
    )
    username = models.CharField(max_length=255, null=True, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    api_key = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "Plugin"
        verbose_name_plural = "Plugins"
        # Constraint that either username and password or api_key must be provided
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(
                        models.Q(username__isnull=False, password__isnull=False),
                        ~models.Q(username__exact=""),
                        ~models.Q(password__exact=""),
                    )
                    | models.Q(
                        models.Q(api_key__isnull=False), ~models.Q(api_key__exact="")
                    )
                ),
                name="either_username_password_or_api_key_required",
                violation_error_message="Either username and password or api_key must be provided.",
            )
        ]

    def __str__(self):
        return self.name
