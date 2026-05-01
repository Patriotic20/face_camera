from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PersonCreate(BaseModel):
    first_name: str
    last_name: str
    third_name: Optional[str] = None
    in_work: bool = True


class PersonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    third_name: Optional[str]
    in_work: bool
    created_at: datetime
    updated_at: datetime


class PersonList(BaseModel):
    page: int
    size: int
    total: int
    persons: list[PersonResponse]


class PersonUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    in_work: Optional[bool] = None
