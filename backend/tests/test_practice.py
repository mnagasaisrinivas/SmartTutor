import pytest
from httpx import AsyncClient
from unittest.mock import patch
from app.utils.practice_api import PracticeProblems

@pytest.fixture
async def auth_headers(client: AsyncClient):
    res = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "practice@example.com",
            "password": "password123"
        },
    )
    return {"Authorization": f"Bearer {res.json()['token']}"}

@pytest.mark.asyncio
@patch("app.api.routes.practice.get_practice_problems")
async def test_generate_practice(mock_get_practice, client: AsyncClient, auth_headers: dict):
    mock_get_practice.return_value = PracticeProblems(
        practice_problems=["Problem 1: 1+1=?", "Problem 2: 2+2=?"],
        explanations=["1+1=2", "2+2=4"]
    )

    response = await client.post(
        "/api/practice/",
        json={"subject": "Math", "topic": "Addition"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject"] == "Math"
    assert data["topic"] == "Addition"
    assert len(data["problems"]["practice_problems"]) == 2
    assert data["problems"]["practice_problems"][0] == "Problem 1: 1+1=?"
