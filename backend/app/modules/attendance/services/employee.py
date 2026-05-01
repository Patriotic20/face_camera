from app.models.attendance.employee import Employee
from app.modules.attendance.repositories.employee import EmployeeRepository
from app.modules.attendance.schemes.employee import EmployeeCreate


def _split_full_name(full_name: str) -> tuple[str, str]:
    parts = full_name.strip().split(" ", 1)
    return (parts[0], parts[1]) if len(parts) == 2 else (parts[0], parts[0])


class EmployeeService:
    def __init__(self, employee_repo: EmployeeRepository) -> None:
        self.employee_repo = employee_repo

    async def get_or_create_employee(
        self, external_id: str, full_name: str
    ) -> tuple[Employee, bool]:
        """Return (employee, was_created). was_created=True when a new record was inserted."""
        employee = await self.employee_repo.get_by_external_id(external_id)
        if employee is not None:
            return employee, False

        first_name, last_name = _split_full_name(full_name or external_id)
        created = await self.employee_repo.create_employee(
            EmployeeCreate(
                first_name=first_name,
                last_name=last_name,
                external_id=external_id,
            )
        )
        return created, True
