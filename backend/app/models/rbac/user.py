# app/models/user.py
from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin
from app.models.rbac.user_role_association import user_role_association

from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.rbac.role import Role



class User(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    plain_password: Mapped[str] = mapped_column(nullable=False)
    
    # Many-to-many relationship with Role
    roles: Mapped[list["Role"]] = relationship(
        "Role",
        secondary=user_role_association,
        back_populates="users",
        lazy="selectin"  # Recommended for performance
    )