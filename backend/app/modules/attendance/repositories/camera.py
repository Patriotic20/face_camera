from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.attendance.camera import Camera
from app.modules.attendance.schemes.camera import (
    CameraCreateRequest,
    CameraUpdateRequest,
    CameraListRequest,
    CameraListResponse,
)


class CameraRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_camera(self, data: CameraCreateRequest) -> Camera:
        new_camera = Camera(**data.model_dump())

        try:
            self.session.add(new_camera)
            await self.session.commit()
            await self.session.refresh(new_camera)
            return new_camera
        except IntegrityError:
            await self.session.rollback()
            raise ValueError("Camera with this IP already exists")

    async def list_cameras(self, data: CameraListRequest) -> CameraListResponse:
        query = select(Camera)

        if data.ip_address:
            query = query.where(Camera.ip_address.ilike(f"%{data.ip_address.strip()}%"))
        if data.name:
            query = query.where(Camera.name.ilike(f"%{data.name.strip()}%"))
        if data.login:
            query = query.where(Camera.login.ilike(f"%{data.login.strip()}%"))
        if data.type:
            query = query.where(Camera.type == data.type)

        # Добавляем сортировку для стабильной пагинации
        query = query.order_by(Camera.id)

        # Подсчет общего количества
        total = await self.session.scalar(
            select(func.count()).select_from(query.subquery())
        )

        # Получение данных с пагинацией
        result = await self.session.execute(
            query.offset(data.offset).limit(data.size)
        )
        cameras = result.scalars().all()

        return CameraListResponse(
            total=total,
            page=data.page,
            size=data.size,
            cameras=cameras
        )

    async def get_camera(self, camera_id: int) -> Camera:
        camera = await self.session.get(Camera, camera_id)
        if not camera:
            raise ValueError(f"Camera with id {camera_id} not found")
        return camera

    async def update_camera(self, camera_id: int, data: CameraUpdateRequest) -> Camera:
        camera = await self.get_camera(camera_id)

        try:
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(camera, key, value)

            await self.session.commit()
            await self.session.refresh(camera)
            return camera
        except IntegrityError:
            await self.session.rollback()
            raise ValueError("Camera with this IP address already exists")

    async def delete_camera(self, camera_id: int) -> bool:
        camera = await self.get_camera(camera_id)
        
        await self.session.delete(camera)
        await self.session.commit()
        return True