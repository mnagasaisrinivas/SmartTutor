import pytest
from httpx import ASGITransport, AsyncClient
from main import app
import os

# Set dummy env for testing if not set
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "testsecret"

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to SmartTutor API"}

@pytest.mark.asyncio
async def test_register():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "full_name": "Test User",
            "email": "test@example.com",
            "password": "testpassword"
        }
        response = await ac.post("/api/auth/register", json=payload)
    
    # It might be 400 if user exists in persistent DB, but here we use in-memory
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"
