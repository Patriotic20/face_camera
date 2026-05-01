from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.attendance.attendance import Attendance
from app.modules.attendance.schemes.attendance import AttendanceCreate, AttendanceUpdate


class AttendanceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_attendance(self, data: AttendanceCreate) -> Attendance:
        try:
            new_attendance = Attendance(**data.model_dump())
            self.session.add(new_attendance)
            await self.session.commit()
            await self.session.refresh(new_attendance)
            return new_attendance
        except Exception:
            await self.session.rollback()
            raise

    async def get_all_attendances(self) -> list[Attendance]:
        result = await self.session.execute(
            select(Attendance).options(
                selectinload(Attendance.person),
                selectinload(Attendance.enter_camera),
                selectinload(Attendance.exit_camera),
            )
        )
        return result.scalars().all()

    async def get_attendance_by_id(self, attendance_id: int) -> Attendance | None:
        result = await self.session.execute(
            select(Attendance)
            .where(Attendance.id == attendance_id)
            .options(
                selectinload(Attendance.person),
                selectinload(Attendance.enter_camera),
                selectinload(Attendance.exit_camera),
            )
        )
        return result.scalar_one_or_none()

    async def get_attendances_by_person(self, person_id: int) -> list[Attendance]:
        result = await self.session.execute(
            select(Attendance)
            .where(Attendance.person_id == person_id)
            .options(
                selectinload(Attendance.enter_camera),
                selectinload(Attendance.exit_camera),
            )
        )
        return result.scalars().all()

    async def update_attendance(self, attendance_id: int, data: AttendanceUpdate) -> Attendance | None:
        attendance = await self.get_attendance_by_id(attendance_id)
        if not attendance:
            return None
        try:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(attendance, key, value)
            await self.session.commit()
            await self.session.refresh(attendance)
            return attendance
        except Exception:
            await self.session.rollback()
            raise

    async def delete_attendance(self, attendance_id: int) -> bool:
        attendance = await self.get_attendance_by_id(attendance_id)
        if not attendance:
            return False
        try:
            await self.session.delete(attendance)
            await self.session.commit()
            return True
        except Exception:
            await self.session.rollback()
            raise
