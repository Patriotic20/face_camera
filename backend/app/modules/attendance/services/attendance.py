from app.modules.attendance.repositories.attendance import AttendanceRepository
from app.modules.attendance.repositories.camera import CameraRepository
from app.modules.attendance.schemes.attendance import AttendanceCreate
from app.modules.attendance.services.camera import CameraService
from app.modules.attendance.services.people import PeopleService


class AttendanceService:
    def __init__(
        self,
        camera_repo: CameraRepository,
        attendance_repo: AttendanceRepository,
        camera_service: CameraService,
        people_service: PeopleService,
    ) -> None:
        self.camera_repo = camera_repo
        self.attendance_repo = attendance_repo
        self.camera_service = camera_service
        self.people_service = people_service

    async def sync_logs_for_camera(
        self,
        camera_id: int,
        start_time: str,
        end_time: str,
        limit: int = 1000,
    ) -> dict[str, int]:
        """
        Fetch access logs from a camera for the given window, resolve persons,
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

            person, was_created = await self.people_service.get_or_create_person(
                external_id, card_name
            )
            if was_created:
                synced_people += 1

            if await self.attendance_repo.exists(person.id, enter_time):
                skipped_duplicates += 1
                continue

            await self.attendance_repo.create_attendance(
                AttendanceCreate(
                    person_id=person.id,
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
