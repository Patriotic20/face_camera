from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SchedulerConfigBase(BaseModel):
    morning_hour: int
    morning_minute: int
    evening_hour: int
    evening_minute: int


class SchedulerConfigUpdate(BaseModel):
    morning_hour: Optional[int] = None
    morning_minute: Optional[int] = None
    evening_hour: Optional[int] = None
    evening_minute: Optional[int] = None


class SchedulerConfigResponse(SchedulerConfigBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime