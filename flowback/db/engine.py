from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
import os

MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

engine = create_async_engine(f"mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@flow-sql:3306/{MYSQL_DATABASE}", pool_recycle = 500)

async_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    bind=engine,
    class_=AsyncSession
)

async def get_db():
    async with async_session() as db:
        try:
            yield db
        finally:
            await db.close()
