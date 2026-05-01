from fastapi import APIRouter, Depends


router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/add")
async def add_employee():
    return {"message": "Employee added successfully"}

@router.get("/{employee_id}")
async def get_employee(employee_id: int):
    return {"message": f"Employee details for employee_id: {employee_id}"}

@router.get("/list")
async def get_employees():
    return {"message": "List of all employees"}

@router.put("/{employee_id}/update")
async def update_employee(employee_id: int):
    return {"message": f"Employee with employee_id: {employee_id} updated successfully"}

@router.delete("/{employee_id}/delete")
async def delete_employee(employee_id: int):
    return {"message": f"Employee with employee_id: {employee_id} deleted successfully"}