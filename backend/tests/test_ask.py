import pytest
from httpx import AsyncClient
from unittest.mock import patch
from app.utils.ask_api import Explanation

@pytest.fixture
async def auth_headers(client: AsyncClient):
    res = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "ask@example.com",
            "password": "password123"
        },
    )
    token = res.json()["token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
@patch("app.api.routes.ask.get_structured_explanation")
async def test_ask_question(mock_get_explanation, client: AsyncClient, auth_headers: dict):
    # Mock the LLM response
    mock_get_explanation.return_value = Explanation(
        title="Math Basics",
        steps=["Step 1: 2", "Step 2: + 2 = 4"],
        summary="Basic addition."
    )

    response = await client.post(
        "/api/ask/",
        json={"subject": "Math", "question": "What is 2+2?"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject"] == "Math"
    assert data["question"] == "What is 2+2?"
    assert data["explanation"]["title"] == "Math Basics"

@pytest.mark.asyncio
async def test_save_and_get_saved_questions(client: AsyncClient, auth_headers: dict):
    # Save question
    save_response = await client.post(
        "/api/ask/save",
        json={
            "subject": "Math",
            "question": "What is 2+2?",
            "answer_steps": ["Step 1: 2", "Step 2: + 2 = 4"],
            "answer_summary": "Basic addition."
        },
        headers=auth_headers
    )
    assert save_response.status_code == 200
    assert save_response.json() == {"message": "Question saved successfully."}

    # Get saved questions
    get_response = await client.get("/api/ask/saved", headers=auth_headers)
    assert get_response.status_code == 200
    data = get_response.json()
    assert len(data) == 1
    assert data[0]["subject"] == "Math"
    assert data[0]["question_text"] == "What is 2+2?"
    assert data[0]["answer_steps"] == ["Step 1: 2", "Step 2: + 2 = 4"]

@pytest.mark.asyncio
async def test_delete_saved_question(client: AsyncClient, auth_headers: dict):
    # Save question
    await client.post(
        "/api/ask/save",
        json={
            "subject": "Math",
            "question": "What is 2+2?",
            "answer_steps": ["Step 1"],
            "answer_summary": "Summary"
        },
        headers=auth_headers
    )

    get_response = await client.get("/api/ask/saved", headers=auth_headers)
    question_id = get_response.json()[0]["id"]

    # Delete
    del_response = await client.delete(f"/api/ask/{question_id}", headers=auth_headers)
    assert del_response.status_code == 200

    # Verify deleted
    get_empty_response = await client.get("/api/ask/saved", headers=auth_headers)
    assert len(get_empty_response.json()) == 0
