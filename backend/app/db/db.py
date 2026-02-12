from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import Settings


# Defining Base class to create all the tables
class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    Settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in Settings.DATABASE_URL
    else {},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# Creating DB and Tables asynchronsly
async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Database Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
