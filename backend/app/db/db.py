from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass

from app.core.config import settings

load_dotenv()


# Defining Base class to create all the tables
class Base(MappedAsDataclass, DeclarativeBase, kw_only=True):
    pass


engine = create_async_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in settings.DATABASE_URL
    else {},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# Creating DB and Tables asynchronsly
async def create_db_and_tables():
    if settings.INITIALIZE_DB:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    else:
        # Just verify connection or skip
        pass


# Database Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
