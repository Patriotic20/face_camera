from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer


class SchedulerConfig(Base, IdIntPk, TimestampMixin):
    __tablename__ = "scheduler_configs"

    morning_hour: Mapped[int] = mapped_column(Integer, nullable=False, default=9)
    morning_minute: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    evening_hour: Mapped[int] = mapped_column(Integer, nullable=False, default=18)
    evening_minute: Mapped[int] = mapped_column(Integer, nullable=False, default=0)