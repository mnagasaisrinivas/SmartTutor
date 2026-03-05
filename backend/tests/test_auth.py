import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@example.com",
            "password": "testpassword123"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["full_name"] == "Test User"


@pytest.mark.asyncio
async def test_register_existing_user(client: AsyncClient):
    # Register first time
    await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "test2@example.com",
            "password": "testpassword123"
        },
    )
    
    # Try again
    response = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User 2",
            "email": "test2@example.com",
            "password": "anotherpassword"
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    # Register
    await client.post(
        "/api/auth/register",
        json={
            "full_name": "Login User",
            "email": "login@example.com",
            "password": "testpassword123"
        },
    )

    # Login
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "testpassword123"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "login@example.com"

@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    # Register
    await client.post(
        "/api/auth/register",
        json={
            "full_name": "Login User",
            "email": "login2@example.com",
            "password": "testpassword123"
        },
    )

    # Login
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "login2@example.com",
            "password": "wrongpassword"
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me(client: AsyncClient):
    # Register
    register_response = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Me User",
            "email": "me@example.com",
            "password": "testpassword123"
        },
    )
    token = register_response.json()["token"]

    # Get me
    response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me User"
