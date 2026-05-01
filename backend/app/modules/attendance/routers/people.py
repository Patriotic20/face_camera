from fastapi import APIRouter, Depends


router = APIRouter(prefix="/people", tags=["People"])

@router.post("/add")
async def add_person():
    return {"message": "Person added successfully"}

@router.get("/{person_id}")
async def get_person(person_id: int):
    return {"message": f"Person details for person_id: {person_id}"}

@router.get("/list")
async def get_people():
    return {"message": "List of all people"}

@router.put("/{person_id}/update")
async def update_person(person_id: int):
    return {"message": f"Person with person_id: {person_id} updated successfully"}

@router.delete("/{person_id}/delete")
async def delete_person(person_id: int):
    return {"message": f"Person with person_id: {person_id} deleted successfully"}