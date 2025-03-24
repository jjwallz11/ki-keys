# scripts/create_tables.py
import asyncio
from app.utils.db import Base  # this should point to your async Base
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings  # or wherever your DATABASE_URL is

DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=True)

async def create_all_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ All tables created successfully.")

if __name__ == "__main__":
    asyncio.run(create_all_tables())