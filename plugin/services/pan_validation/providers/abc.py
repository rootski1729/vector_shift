from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from plugin.models import Plugin

class AbstractPANValidationProvider(ABC):

    @abstractmethod
    async def validate_pan(self, plugin: "Plugin", pan_number: str) -> bool:
        pass
