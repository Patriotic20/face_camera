from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_helper
from app.modules.attendance.repositories.attendance import AttendanceRepository
from app.modules.attendance.schemes.attendance import AttendanceDetailResponse

router = APIRouter(tags=["Attendance"])


@router.get("/list", response_model=list[AttendanceDetailResponse])
async def get_attendance_records(session: AsyncSession = Depends(db_helper.session_getter)):
    repo = AttendanceRepository(session)
    return await repo.get_all_attendances()


@router.get("/employee/{employee_id}", response_model=list[AttendanceDetailResponse])
async def get_attendance_by_employee(
    employee_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = AttendanceRepository(session)
    return await repo.get_attendances_by_employee(employee_id)


@router.get("/date/{date}", response_model=list[AttendanceDetailResponse])
async def get_attendance_for_date(
    date: str,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = AttendanceRepository(session)
    return await repo.get_attendances_by_date(date)


@router.get("/month/{year}/{month}", response_model=list[AttendanceDetailResponse])
async def get_attendance_for_month(
    year: int,
    month: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = AttendanceRepository(session)
    return await repo.get_attendances_by_month(year, month)


@router.get("/{attendance_id}", response_model=AttendanceDetailResponse)
async def get_attendance_record(
    attendance_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = AttendanceRepository(session)
    record = await repo.get_attendance_by_id(attendance_id)
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return record
