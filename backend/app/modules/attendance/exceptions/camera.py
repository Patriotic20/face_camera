from fastapi import HTTPException, status


class CameraNotFoundError(Exception):
    pass


class CameraAlreadyExistsError(Exception):
    pass


# Глобальный обработчик для наших исключений
def _handle_camera_exc(exc):
    if isinstance(exc, CameraNotFoundError):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Камера не найдена"
        )
    if isinstance(exc, CameraAlreadyExistsError):
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc)
        )
    return None


# Регистрация в main.py (или в файле с глобальными обработчиками):
#
# from fastapi import FastAPI
# from app.modules.attendance.exceptions import _handle_camera_exc
#
# app = FastAPI()
# app.add_exception_handler(CameraNotFoundError, _handle_camera_exc)
# app.add_exception_handler(CameraAlreadyExistsError, _handle_camera_exc)