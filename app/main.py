# app/main.py
from fastapi import FastAPI
from routes import router
from config import settings
import logging
from utils.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Patriotic Keys API", debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

@app.on_event("startup")
async def startup_event():
    logging.info("Starting up the Patriotic Keys API")
    if settings.ENVIRONMENT != "production":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logging.info("✅ Async database tables created")
    else:
        logging.info("🚫 Production environment detected; skipping table creation")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down the Patriotic Keys API")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Welcome to Patriotic Keys API"}

if settings.ENVIRONMENT == "production":
    origins = ["https://yourdomain.com"]
else:
    origins = ["*"]