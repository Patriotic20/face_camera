import logging
from datetime import datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.db import AsyncSessionLocal
from app.models.attendance.camera import CameraStatus
from app.modules.attendance.repositories.attendance import AttendanceRepository
from app.modules.attendance.repositories.camera import CameraRepository
from app.modules.attendance.repositories.people import PeopleRepository
from app.modules.attendance.services.attendance import AttendanceService
from app.modules.attendance.services.camera import CameraService
from app.modules.attendance.services.people import PeopleService

logger = logging.getLogger(__name__)


def _build_window(base_hhmm: str, date: datetime) -> tuple[str, str]:
    """Return (start, end) strings for a 1-hour window starting at base_hhmm on date."""
    hour, minute = int(base_hhmm[:2]), int(base_hhmm[3:])
    start_dt = date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    end_dt = start_dt + timedelta(hours=1)
    fmt = "%Y-%m-%d %H:%M:%S"
    return start_dt.strftime(fmt), end_dt.strftime(fmt)


async def _run_sync(use_work_start: bool) -> None:
    today = datetime.now()
    async with AsyncSessionLocal() as session:
        camera_repo = CameraRepository(session)
        people_repo = PeopleRepository(session)
        attendance_repo = AttendanceRepository(session)
        camera_service = CameraService()
        people_service = PeopleService(people_repo)
        attendance_service = AttendanceService(
            camera_repo=camera_repo,
            attendance_repo=attendance_repo,
            camera_service=camera_service,
            people_service=people_service,
        )

        cameras = await camera_repo.get_all_cameras()
        for camera in cameras:
            if camera.status != CameraStatus.ACTIVE:
                continue

            base_time = camera.work_start_time if use_work_start else camera.work_end_time
            start_time, end_time = _build_window(base_time, today)

            try:
                result = await attendance_service.sync_logs_for_camera(
                    camera_id=camera.id,
                    start_time=start_time,
                    end_time=end_time,
                )
                logger.info(
                    "Camera %d synced: %s",
                    camera.id,
                    result,
                )
            except Exception:
                logger.exception("Failed to sync camera %d", camera.id)


async def _morning_sync() -> None:
    """Runs at 09:00 — collects arrivals from the work_start_time window."""
    await _run_sync(use_work_start=True)


async def _evening_sync() -> None:
    """Runs at 18:00 — collects departures from the work_end_time window."""
    await _run_sync(use_work_start=False)


def create_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(_morning_sync, "cron", hour=9, minute=0, id="morning_sync")
    scheduler.add_job(_evening_sync, "cron", hour=18, minute=0, id="evening_sync")
    return scheduler
