from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.attendance.camera import Camera
from app.modules.attendance.schemes.camera import CameraCreate, CameraUpdate


class CameraRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_camera(self, data: CameraCreate) -> Camera:
        try:
            new_camera = Camera(**data.model_dump())
            self.session.add(new_camera)
            await self.session.commit()
            await self.session.refresh(new_camera)
            return new_camera
        except Exception:
            await self.session.rollback()
            raise

    async def get_all_cameras(self) -> list[Camera]:
        result = await self.session.execute(select(Camera))
        return result.scalars().all()

    async def get_camera_by_id(self, camera_id: int) -> Camera | None:
        result = await self.session.execute(
            select(Camera).where(Camera.id == camera_id)
        )
        return result.scalar_one_or_none()

    async def update_camera(self, camera_id: int, data: CameraUpdate) -> Camera | None:
        camera = await self.get_camera_by_id(camera_id)
        if not camera:
            return None
        try:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(camera, key, value)
            await self.session.commit()
            await self.session.refresh(camera)
            return camera
        except Exception:
            await self.session.rollback()
            raise

    async def delete_camera(self, camera_id: int) -> bool:
        camera = await self.get_camera_by_id(camera_id)
        if not camera:
            return False
        try:
            await self.session.delete(camera)
            await self.session.commit()
            return True
        except Exception:
            await self.session.rollback()
            raise
