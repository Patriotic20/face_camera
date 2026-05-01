from fastapi import APIRouter


router = APIRouter(prefix="/camera", tags=["Camera"])


@router.post("/add")
async def add_camera():
    return {"message": "Camera added successfully"}

@router.get("/{camera_id}")
async def get_camera(camera_id: int):
    return {"message": f"Camera details for camera_id: {camera_id}"}

@router.get("/list")
async def get_camera_attendance():
    return {"message": "List of all camera attendance records"}


@router.put("/{camera_id}/update")
async def update_camera(camera_id: int):
    return {"message": f"Camera with camera_id: {camera_id} updated successfully"}

@router.delete("/{camera_id}/delete")
async def delete_camera(camera_id: int):
    return {"message": f"Camera with camera_id: {camera_id} deleted successfully"}