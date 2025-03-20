from fastapi import FastAPI
from app.routes import router  # Imports all routes via your index file
from app.config import settings
import logging
from app.utils.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app with a title and debug mode based on config
app = FastAPI(title="Patriotic Keys API", debug=settings.DEBUG)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

@app.on_event("startup")
async def startup_event():
    logging.info("Starting up the Patriotic Keys API")
    if settings.ENVIRONMENT != "production":
        # For local development, create database tables if they don't exist.
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables created")
    else:
        logging.info("Production environment detected; skipping table creation.")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down the Patriotic Keys API")
    # Add any cleanup tasks here, such as closing database connections.

# Include all routes from the routes index file
app.include_router(router)

@app.get("/")
def root():
    return {"message": "Welcome to Patriotic Keys API"}

# Optionally, add custom exception handlers if needed.
# For example, handling validation errors:
#
# from fastapi.exceptions import RequestValidationError
# from fastapi.responses import JSONResponse
#
# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):
#     logging.error(f"Validation error: {exc}")
#     return JSONResponse(
#         status_code=422,
#         content={"message": "Validation error", "errors": exc.errors()},
#     )

if settings.ENVIRONMENT == "production":
    origins = ["https://yourdomain.com"]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)