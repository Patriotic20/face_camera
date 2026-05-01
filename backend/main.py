from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.scheduler import create_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = create_scheduler()
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Face Camera", lifespan=lifespan)
