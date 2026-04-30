from fastapi import APIRouter, Depends


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
async def create_user():
    return {"message": "User created successfully"}

@router.post("/login")
async def login():
    return {"message": "User logged in successfully"}

@router.post("/logout")
async def logout():
    return {"message": "User logged out successfully"}

@router.post("/refresh")
async def refresh_token():
    return {"message": "Token refreshed successfully"}

@router.post("/forgot-password")
async def forgot_password():
    return {"message": "Password reset link sent successfully"}

@router.post("/reset-password")
async def reset_password():
    return {"message": "Password reset successfully"}

@router.post("/change-password")
async def change_password():
    return {"message": "Password changed successfully"}