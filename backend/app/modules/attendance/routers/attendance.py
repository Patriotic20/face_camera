from fastapi import APIRouter, Depends



router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.get("/list")
async def get_attendance_records():
    return {"message": "List of all attendance records"}

@router.get("/{attendance_id}")
async def get_attendance_record(attendance_id: int):
    return {"message": f"Attendance record details for attendance_id: {attendance_id}"}

@router.get("/employee/{employee_id}")
async def get_attendance_by_employee(employee_id: int):
    return {"message": f"Attendance records for employee_id: {employee_id}"}