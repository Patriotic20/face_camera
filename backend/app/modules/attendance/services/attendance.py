import re
from datetime import datetime, timezone

import httpx

from app.modules.attendance.repositories.attendance import AttendanceRepository
from app.modules.attendance.repositories.camera import CameraRepository
from app.modules.attendance.repositories.people import PeopleRepository
from app.modules.attendance.schemes.attendance import AttendanceCreate
from app.modules.attendance.schemes.people import PersonCreate

_RECORD_RE = re.compile(r"records\[(\d+)\]\.(\w+)=(.*)")


def _parse_camera_response(text: str) -> list[dict[str, str]]:
    raw: dict[int, dict[str, str]] = {}
    for line in text.splitlines():
        m = _RECORD_RE.match(line)
        if m:
            idx, key, value = m.groups()
            raw.setdefault(int(idx), {})[key] = value.strip()
    return [raw[i] for i in sorted(raw)]


def _split_full_name(card_name: str) -> tuple[str, str]:
    parts = card_name.strip().split(" ", 1)
    return (parts[0], parts[1]) if len(parts) == 2 else (parts[0], parts[0])


class AttendanceService:
    def __init__(
        self,
        people_repo: PeopleRepository,
        attendance_repo: AttendanceRepository,
        camera_repo: CameraRepository,
    ) -> None:
        self.people_repo = people_repo
        self.attendance_repo = attendance_repo
        self.camera_repo = camera_repo

    async def sync_camera_logs(
        self,
        camera_id: int,
        start_date: str,
        end_date: str,
        limit: int = 1000,
    ) -> dict[str, int]:
        """
        Fetch access logs from camera, create missing Person records,
        and insert new Attendance entries.

        Returns counts of synced_people, synced_attendances, skipped_duplicates.
        """
        camera = await self.camera_repo.get_camera_by_id(camera_id)
        if camera is None:
            raise ValueError(f"Camera {camera_id} not found")

        url = f"http://{camera.ip_address}/cgi-bin/recordFinder.cgi"
        params = {
            "action": "find",
            "name": "AccessControlCardRec",
            "condition.Channel": 1,
            "condition.StartTime": start_date,
            "condition.EndTime": end_date,
            "count": limit,
            "start": 0,
        }

        async with httpx.AsyncClient(
            auth=httpx.DigestAuth(camera.login, camera.password),
            timeout=30,
        ) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        records = _parse_camera_response(response.text)

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

            person = await self.people_repo.get_by_external_id(external_id)
            if person is None:
                first_name, last_name = _split_full_name(card_name)
                person = await self.people_repo.create_person(
                    PersonCreate(
                        first_name=first_name,
                        last_name=last_name,
                        external_id=external_id,
                    )
                )
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
