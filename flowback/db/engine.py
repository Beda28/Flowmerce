from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import create_engine
import os

MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

engine = create_async_engine(
    f"mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@flow-sql:3306/{MYSQL_DATABASE}?charset=utf8mb4",
    pool_recycle=300,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=True,
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with async_session() as db:
        try:
            yield db
        finally:
            await db.close()
