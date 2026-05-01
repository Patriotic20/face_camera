from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, computed_field, Field
from datetime import time

from app.models.attendance.camera import CameraType, CameraStatus


class CameraBase(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        min_anystr_length=1,
        validate_all=True,
        extra="forbid",
    )
    
    name: str
    ip_address: str
    login: str
    type: CameraType
    work_start_time: time = Field(default=time(9, 0))
    work_end_time: time = Field(default=time(18, 0))


class CameraCreateRequest(CameraBase):
    password: str


class CameraUpdateRequest(BaseModel):
    
    model_config = ConfigDict(
        str_strip_whitespace=True,
        min_anystr_length=1,
        validate_all=True,
        extra="forbid",
    )
    
    name: Optional[str] = None
    ip_address: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None
    type: Optional[CameraType] = None
    status: Optional[CameraStatus] = None
    work_start_time: Optional[time] = None
    work_end_time: Optional[time] = None


class CameraListRequest(BaseModel):
    
    page: int = Field(default=1, ge=1)
    size: int = Field(default=10, ge=1, le=100)
    ip_address: Optional[str] = None
    name: Optional[str] = None
    login: Optional[str] = None
    type: Optional[CameraType] = None
    
    @computed_field
    @property
    def offset(self) -> int:
        """Вычисляем offset для SQL запроса"""
        return (self.page - 1) * self.size


class CameraResponse(CameraBase):
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    status: CameraStatus
    created_at: datetime
    updated_at: datetime


class CameraListResponse(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)
    
    total: int
    page: int
    size: int
    cameras: list[CameraResponse]