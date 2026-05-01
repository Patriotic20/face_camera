from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PersonBase(BaseModel):
    first_name: str
    last_name: str
    third_name: Optional[str] = None
    in_work: bool = True


class PersonCreate(PersonBase):
    pass


class PersonUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    in_work: Optional[bool] = None


class PersonResponse(PersonBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class PersonList(BaseModel):
    page: int
    size: int
    total: int
    persons: list[PersonResponse]
