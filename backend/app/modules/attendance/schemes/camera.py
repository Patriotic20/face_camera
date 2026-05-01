from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

from app.models.attendance.camera import CameraType, CameraStatus


class CameraBase(BaseModel):
    name: str
    ip_address: str
    login: str
    type: CameraType


class CameraCreate(CameraBase):
    password: str


class CameraUpdate(BaseModel):
    name: Optional[str] = None
    ip_address: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None
    type: Optional[CameraType] = None
    status: Optional[CameraStatus] = None


class CameraResponse(CameraBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CameraStatus
    created_at: datetime
    updated_at: datetime
