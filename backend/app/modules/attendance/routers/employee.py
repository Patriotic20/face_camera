from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_helper
from app.modules.attendance.repositories.employee import EmployeeRepository
from app.modules.attendance.schemes.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter(tags=["Employees"])


@router.get("/list", response_model=list[EmployeeResponse])
async def get_employees(session: AsyncSession = Depends(db_helper.session_getter)):
    repo = EmployeeRepository(session)
    return await repo.get_all_employees()


@router.post("/add", response_model=EmployeeResponse, status_code=201)
async def add_employee(
    data: EmployeeCreate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = EmployeeRepository(session)
    return await repo.create_employee(data)


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = EmployeeRepository(session)
    employee = await repo.get_employee_by_id(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/{employee_id}/update", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = EmployeeRepository(session)
    employee = await repo.update_employee(employee_id, data)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.delete("/{employee_id}/delete", status_code=204)
async def delete_employee(
    employee_id: int,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    repo = EmployeeRepository(session)
    deleted = await repo.delete_employee(employee_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
