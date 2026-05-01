from .attendance import router as attendance
from .camera import router as camera
from .employee import router as employee
from .scheduler_config import router as scheduler_config

__all__ = ["attendance", "camera", "employee", "scheduler_config"]