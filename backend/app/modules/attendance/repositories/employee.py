from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.attendance.employee import Employee
from app.modules.attendance.schemes.employee import EmployeeCreate, EmployeeUpdate


class EmployeeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_employee(self, data: EmployeeCreate) -> Employee:
        try:
            new_employee = Employee(**data.model_dump())
            self.session.add(new_employee)
            await self.session.commit()
            await self.session.refresh(new_employee)
            return new_employee
        except Exception:
            await self.session.rollback()
            raise

    async def get_all_employees(self) -> list[Employee]:
        result = await self.session.execute(select(Employee))
        return result.scalars().all()

    async def get_employee_by_id(self, employee_id: int) -> Employee | None:
        result = await self.session.execute(
            select(Employee).where(Employee.id == employee_id)
        )
        return result.scalar_one_or_none()

    async def get_by_external_id(self, external_id: str) -> Employee | None:
        result = await self.session.execute(
            select(Employee).where(Employee.external_id == external_id)
        )
        return result.scalar_one_or_none()

    async def update_employee(self, employee_id: int, data: EmployeeUpdate) -> Employee | None:
        employee = await self.get_employee_by_id(employee_id)
        if not employee:
            return None
        try:
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(employee, key, value)
            await self.session.commit()
            await self.session.refresh(employee)
            return employee
        except Exception:
            await self.session.rollback()
            raise

    async def delete_employee(self, employee_id: int) -> bool:
        employee = await self.get_employee_by_id(employee_id)
        if not employee:
            return False
        try:
            await self.session.delete(employee)
            await self.session.commit()
            return True
        except Exception:
            await self.session.rollback()
            raise
