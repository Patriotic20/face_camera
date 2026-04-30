# app/models/rbac/permission.py
from app.models.base import Base
from app.core.mixins.id_int_pk import IdIntPk
from app.core.mixins.time_stamp_mixin import TimestampMixin
from app.models.rbac.role_permission_association import role_permission_association

from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.rbac.role import Role

class Permission(Base, IdIntPk, TimestampMixin):
    
    __tablename__ = "permissions"

    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    action: Mapped[str] = mapped_column(nullable=False)
    resource: Mapped[str] = mapped_column(nullable=False)
    
    # Many-to-many relationship with Role
    roles: Mapped[list["Role"]] = relationship(
        "Role",
        secondary=role_permission_association,
        back_populates="permissions",
        lazy="selectin"
    )