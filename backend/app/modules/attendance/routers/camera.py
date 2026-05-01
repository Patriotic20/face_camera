from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_helper
from app.modules.attendance.repositories.camera import CameraRepository
from app.modules.attendance.schemes.camera import CameraCreate, CameraUpdate, CameraResponse

router = APIRouter(tags=["Camera"])


@router.get("/list", response_model=list[CameraResponse])
async def get_cameras(session: AsyncSession = Depends(db_helper.session_getter)):
    repo = CameraRepository(session)
    return await repo.get_all_cameras()


@router.post("/add", response_model=CameraResponse, status_code=201)
async def add_camera(
    data: CameraCreate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = CameraRepository(session)
    return await repo.create_camera(data)


@router.get("/{camera_id}", response_model=CameraResponse)
async def get_camera(
    camera_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = CameraRepository(session)
    camera = await repo.get_camera_by_id(camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera


@router.put("/{camera_id}/update", response_model=CameraResponse)
async def update_camera(
    camera_id: int,
    data: CameraUpdate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = CameraRepository(session)
    camera = await repo.update_camera(camera_id, data)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera


@router.delete("/{camera_id}/delete", status_code=204)
async def delete_camera(
    camera_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = CameraRepository(session)
    deleted = await repo.delete_camera(camera_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Camera not found")
