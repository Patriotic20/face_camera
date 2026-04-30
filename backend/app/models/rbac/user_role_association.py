from sqlalchemy import Table, Column, ForeignKey
from app.models.base import Base


user_role_association = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', ForeignKey('users.id'), primary_key=True),
    Column('role_id', ForeignKey('roles.id'), primary_key=True)
)