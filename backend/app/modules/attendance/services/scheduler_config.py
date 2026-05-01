from app.modules.attendance.repositories.scheduler_config import SchedulerConfigRepository
from app.modules.attendance.schemes.scheduler_config import SchedulerConfigResponse, SchedulerConfigUpdate


class SchedulerConfigService:
    def __init__(self, repo: SchedulerConfigRepository) -> None:
        self.repo = repo

    async def get_config(self) -> SchedulerConfigResponse | None:
        config = await self.repo.get_config()
        if config:
            return SchedulerConfigResponse.model_validate(config)
        return None

    async def update_config(self, data: SchedulerConfigUpdate) -> SchedulerConfigResponse:
        config = await self.repo.update_config(data)
        return SchedulerConfigResponse.model_validate(config)