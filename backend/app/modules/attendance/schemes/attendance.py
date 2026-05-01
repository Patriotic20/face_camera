from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AttendanceBase(BaseModel):
    employee_id: int
    enter_camera_id: int
    enter_time: str
    status: str


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    exit_camera_id: Optional[int] = None
    exit_time: Optional[str] = None
    status: Optional[str] = None
    working_hours: Optional[float] = None


class AttendanceResponse(AttendanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    exit_camera_id: Optional[int]
    exit_time: Optional[str]
    working_hours: Optional[float]
    created_at: datetime
    updated_at: datetime


class EmployeeBasicInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    third_name: Optional[str]


class CameraBasicInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class AttendanceDetailResponse(AttendanceResponse):
    employee: EmployeeBasicInfo
    enter_camera: CameraBasicInfo
    exit_camera: Optional[CameraBasicInfo]
