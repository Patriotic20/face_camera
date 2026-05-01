from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey


class Attendance(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "attendances"

    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    enter_camera_id: Mapped[int] = mapped_column(ForeignKey("cameras.id"), nullable=False)
    exit_camera_id: Mapped[int] = mapped_column(ForeignKey("cameras.id"), nullable=True)
    enter_time: Mapped[str] = mapped_column(nullable=False)
    exit_time: Mapped[str] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(nullable=False)  
    working_hours: Mapped[float] = mapped_column(nullable=True)  
    
    # Relationships
    employee = relationship("Employee", backref="attendances", lazy="joined")
    enter_camera = relationship("Camera", foreign_keys=[enter_camera_id], backref="enter_attendances", lazy="joined")
    exit_camera = relationship("Camera", foreign_keys=[exit_camera_id], backref="exit_attendances", lazy="joined")