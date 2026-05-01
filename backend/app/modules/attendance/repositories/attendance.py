from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.attendance.attendance import Attendance
from app.modules.attendance.schemes.attendance import AttendanceCreate, AttendanceUpdate


class AttendanceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _base_query(self):
        return select(Attendance).options(
            selectinload(Attendance.employee),
            selectinload(Attendance.enter_camera),
            selectinload(Attendance.exit_camera),
        )

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
        result = await self.session.execute(self._base_query())
        return result.scalars().all()

    async def get_attendance_by_id(self, attendance_id: int) -> Attendance | None:
        result = await self.session.execute(
            self._base_query().where(Attendance.id == attendance_id)
        )
        return result.scalar_one_or_none()

    async def get_attendances_by_employee(self, employee_id: int) -> list[Attendance]:
        result = await self.session.execute(
            self._base_query().where(Attendance.employee_id == employee_id)
        )
        return result.scalars().all()

    async def get_attendances_by_date(self, date: str) -> list[Attendance]:
        result = await self.session.execute(
            self._base_query().where(Attendance.enter_time.startswith(date))
        )
        return result.scalars().all()

    async def get_attendances_by_month(self, year: int, month: int) -> list[Attendance]:
        prefix = f"{year}-{month:02d}"
        result = await self.session.execute(
            self._base_query().where(Attendance.enter_time.startswith(prefix))
        )
        return result.scalars().all()

    async def exists(self, employee_id: int, enter_time: str) -> bool:
        result = await self.session.execute(
            select(Attendance.id).where(
                Attendance.employee_id == employee_id,
                Attendance.enter_time == enter_time,
            )
        )
        return result.scalar_one_or_none() is not None

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
