from enum import StrEnum, auto
from plugin.services.pan_validation import providers as PANValidationProviders
from plugin.services.pan_eligibility import providers as PANElegibilityProviders


class PluginProvider(StrEnum):
    NSDL = auto()
    UNISEN = auto()

    def plugin(self):
        if self == PluginProvider.NSDL:
            return PANValidationProviders.NSDL
        elif self == PluginProvider.UNISEN:
            return PANElegibilityProviders.Unisen
        return None


class PluginService(StrEnum):
    PAN_VALIDATION = auto()
    PAN_ELIGIBILITY = auto()

    def providers(self):
        if self == PluginService.PAN_VALIDATION:
            return [PluginProvider.NSDL]
        elif self == PluginService.PAN_ELIGIBILITY:
            return [PluginProvider.UNISEN]
        return []
