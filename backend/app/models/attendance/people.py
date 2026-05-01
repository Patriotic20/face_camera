from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin


from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean
from typing import Optional


class Person(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "people"
    
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    third_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    in_work: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    