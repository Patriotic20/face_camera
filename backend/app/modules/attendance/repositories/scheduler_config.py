from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.attendance.scheduler_config import SchedulerConfig
from app.modules.attendance.schemes.scheduler_config import SchedulerConfigUpdate


class SchedulerConfigRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_config(self) -> SchedulerConfig | None:
        result = await self.session.execute(select(SchedulerConfig).limit(1))
        return result.scalar_one_or_none()

    async def create_default_config(self) -> SchedulerConfig:
        config = SchedulerConfig()
        self.session.add(config)
        await self.session.commit()
        await self.session.refresh(config)
        return config

    async def update_config(self, data: SchedulerConfigUpdate) -> SchedulerConfig | None:
        config = await self.get_config()
        if not config:
            config = await self.create_default_config()
        try:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(config, key, value)
            await self.session.commit()
            await self.session.refresh(config)
            return config
        except Exception:
            await self.session.rollback()
            raise