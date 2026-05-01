# app/models/camera.py
from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Enum
from enum import Enum as PyEnum

# Определяем Enum'ы прямо в файле или импортируем
class CameraType(str, PyEnum):
    ENTER = "enter"
    EXIT = "exit"

class CameraStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Camera(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "cameras"

    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    ip_address: Mapped[str] = mapped_column(unique=True, nullable=False)
    login: Mapped[str] = mapped_column(nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    
    # Используем Enum для type - только "enter" или "exit"
    type: Mapped[CameraType] = mapped_column(
        Enum(CameraType),
        nullable=False
    )
    
    # Используем Enum для status - только "active" или "inactive"
    status: Mapped[CameraStatus] = mapped_column(
        Enum(CameraStatus),
        default=CameraStatus.INACTIVE,
        nullable=False
    )