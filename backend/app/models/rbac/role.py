# app/models/rbac/role.py
from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin
from app.models.rbac.user_role_association import user_role_association
from app.models.rbac.role_permission_association import role_permission_association

from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.rbac.user import User
    from app.models.rbac.permission import Permission

class Role(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    
    # Many-to-many relationship with User
    users: Mapped[list["User"]] = relationship(
        "User",
        secondary=user_role_association,
        back_populates="roles",
        lazy="selectin"
    )
    
    # Many-to-many relationship with Permission
    permissions: Mapped[list["Permission"]] = relationship(
        "Permission",
        secondary=role_permission_association,
        back_populates="roles",
        lazy="selectin"
    )