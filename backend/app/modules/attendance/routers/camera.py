# app/modules/attendance/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_helper
from app.modules.attendance.services.camera import CameraService
from app.modules.attendance.schemes.camera import (
    CameraCreate,
    CameraUpdate,
    CameraListParams,
    CameraResponse,
    CameraListResponse,
)
from app.modules.attendance.exceptions.camera import CameraNotFoundError, CameraAlreadyExistsError

router = APIRouter(
    prefix="/camera",
    tags=["Camera"]
)


@router.post("/add", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
async def add_camera(
    data: CameraCreate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    service = CameraService(session)
    try:
        return await service.create_camera(data)
    except CameraAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/list", response_model=CameraListResponse)
async def get_cameras(
    params: CameraListParams = Depends(),
    session: AsyncSession = Depends(db_helper.session_getter),
):
    service = CameraService(session)
    return await service.list_cameras(params)


@router.get("/{camera_id}", response_model=CameraResponse)
async def get_camera(
    camera_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    service = CameraService(session)
    try:
        return await service.get_camera(camera_id)
    except CameraNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{camera_id}", response_model=CameraResponse)
async def update_camera(
    camera_id: int,
    data: CameraUpdate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    service = CameraService(session)
    try:
        return await service.update_camera(camera_id, data)
    except CameraNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except CameraAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(
    camera_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    service = CameraService(session)
    try:
        await service.delete_camera(camera_id)
    except CameraNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))