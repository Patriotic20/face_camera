from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin

from sqlalchemy.orm import Mapped, mapped_column, relationship


class Attendance(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "attendances"

    user_id: Mapped[int] = mapped_column(nullable=False)
    camera_id: Mapped[int] = mapped_column(nullable=False)
    enter_time: Mapped[str] = mapped_column(nullable=False)
    exit_time: Mapped[str] = mapped_column(nullable=True)
    working_hours: Mapped[float] = mapped_column(nullable=True)  
    
    # Relationships
    user = relationship("User", backref="attendances", lazy="joined")
    camera = relationship("Camera", backref="attendances", lazy="joined")