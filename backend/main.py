from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.scheduler import create_scheduler
from app.modules.attendance.routers import attendance, camera, employee, scheduler_config


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = await create_scheduler()
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Face Camera", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(attendance, prefix="/api/attendance", tags=["attendance"])
app.include_router(camera, prefix="/api/camera", tags=["camera"])
app.include_router(employee, prefix="/api/employee", tags=["employee"])
app.include_router(scheduler_config, prefix="/api/scheduler", tags=["scheduler"])
