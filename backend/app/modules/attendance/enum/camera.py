from enum import Enum as PyEnum

class CameraType(str, PyEnum):
    ENTER = "enter"
    EXIT = "exit"

class CameraStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"