# app/modules/attendance/schemes.py
from datetime import datetime, time
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, IPvAnyAddress
from app.models.attendance.enums import CameraType, CameraStatus


class CameraBase(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
        from_attributes=True,
    )

    name: str = Field(min_length=2, max_length=100)
    ip_address: IPvAnyAddress
    login: str = Field(min_length=1, max_length=50)
    type: CameraType
    work_start_time: time = Field(default=time(8, 0))
    work_end_time: time = Field(default=time(17, 0))

    @field_validator('work_end_time')
    @classmethod
    def validate_work_times(cls, v, info):
        if 'work_start_time' in info.data:
            start = info.data['work_start_time']
            if v <= start:
                raise ValueError('work_end_time must be after work_start_time')
        return v


class CameraCreate(CameraBase):
    password: str = Field(min_length=4, max_length=128)


class CameraUpdate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    name: Optional[str] = Field(None, min_length=2, max_length=100)
    ip_address: Optional[IPvAnyAddress] = None
    login: Optional[str] = Field(None, min_length=1, max_length=50)
    password: Optional[str] = Field(None, min_length=4, max_length=128)
    type: Optional[CameraType] = None
    status: Optional[CameraStatus] = None
    work_start_time: Optional[time] = None
    work_end_time: Optional[time] = None


class CameraListParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=10, ge=1, le=100)
    ip_address: Optional[str] = None
    name: Optional[str] = None
    login: Optional[str] = None
    type: Optional[CameraType] = None

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size


class CameraResponse(CameraBase):
    id: int
    status: CameraStatus
    created_at: datetime
    updated_at: datetime


class CameraListResponse(BaseModel):
    total: int
    page: int
    size: int
    cameras: list[CameraResponse]