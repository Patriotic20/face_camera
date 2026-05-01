from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_helper
from app.modules.attendance.services.scheduler_config import SchedulerConfigService
from app.modules.attendance.repositories.scheduler_config import SchedulerConfigRepository
from app.modules.attendance.schemes.scheduler_config import SchedulerConfigResponse, SchedulerConfigUpdate

router = APIRouter(tags=["Scheduler Config"])


@router.get("/", response_model=SchedulerConfigResponse)
async def get_scheduler_config(session: AsyncSession = Depends(db_helper.session_getter)):
    repo = SchedulerConfigRepository(session)
    service = SchedulerConfigService(repo)
    config = await service.get_config()
    if not config:
        raise HTTPException(status_code=404, detail="Scheduler config not found")
    return config


@router.put("/", response_model=SchedulerConfigResponse)
async def update_scheduler_config(
    data: SchedulerConfigUpdate,
    session: AsyncSession = Depends(db_helper.session_getter)
):
    repo = SchedulerConfigRepository(session)
    service = SchedulerConfigService(repo)
    return await service.update_config(data)