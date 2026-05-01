from app.modules.attendance.repositories.attendance import AttendanceRepository
from app.modules.attendance.repositories.camera import CameraRepository
from app.modules.attendance.schemes.attendance import AttendanceCreate
from app.modules.attendance.services.camera import CameraService
from app.modules.attendance.services.employee import EmployeeService


class AttendanceService:
    def __init__(
        self,
        camera_repo: CameraRepository,
        attendance_repo: AttendanceRepository,
        camera_service: CameraService,
        employee_service: EmployeeService,
    ) -> None:
        self.camera_repo = camera_repo
        self.attendance_repo = attendance_repo
        self.camera_service = camera_service
        self.employee_service = employee_service

    async def sync_logs_for_camera(
        self,
        camera_id: int,
        start_time: str,
        end_time: str,
        limit: int = 1000,
    ) -> dict[str, int]:
        """
        Fetch access logs from a camera for the given window, resolve employees,
        and persist new attendance records.

        Returns counts: synced_people, synced_attendances, skipped_duplicates.
        """
        camera = await self.camera_repo.get_camera_by_id(camera_id)
        if camera is None:
            raise ValueError(f"Camera {camera_id} not found")

        records = await self.camera_service.fetch_raw_logs(
            ip=camera.ip_address,
            login=camera.login,
            password=camera.password,
            start_time=start_time,
            end_time=end_time,
            limit=limit,
        )

        synced_people = 0
        synced_attendances = 0
        skipped_duplicates = 0

        for rec in records:
            if rec.get("Status") != "1":
                continue

            external_id: str = rec.get("UserID", "")
            card_name: str = rec.get("CardName", "") or external_id
            enter_time: str = rec.get("CreateTime", "")

            if not external_id or not enter_time:
                continue

            employee, was_created = await self.employee_service.get_or_create_employee(
                external_id, card_name
            )
            if was_created:
                synced_people += 1

            if await self.attendance_repo.exists(employee.id, enter_time):
                skipped_duplicates += 1
                continue

            await self.attendance_repo.create_attendance(
                AttendanceCreate(
                    employee_id=employee.id,
                    enter_camera_id=camera_id,
                    enter_time=enter_time,
                    status=rec.get("Status", ""),
                )
            )
            synced_attendances += 1

        return {
            "synced_people": synced_people,
            "synced_attendances": synced_attendances,
            "skipped_duplicates": skipped_duplicates,
        }
