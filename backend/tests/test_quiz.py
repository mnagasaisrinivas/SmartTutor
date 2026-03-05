import pytest
from httpx import AsyncClient
from unittest.mock import patch
from app.utils.quiz_api import Quiz, QuizQuestion

@pytest.fixture
async def auth_headers(client: AsyncClient):
    res = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "quiz@example.com",
            "password": "password123"
        },
    )
    return {"Authorization": f"Bearer {res.json()['token']}"}

@pytest.mark.asyncio
@patch("app.api.routes.quiz.get_quiz_questions")
async def test_generate_quiz(mock_get_quiz, client: AsyncClient, auth_headers: dict):
    mock_get_quiz.return_value = Quiz(
        questions=[
            QuizQuestion(
                id=1,
                question="What is 1+1?",
                options=["1", "2", "3", "4"],
                correctAnswer=1
            )
        ]
    )

    response = await client.post(
        "/api/quiz/generate",
        json={"subject": "Math", "topic": "Addition"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject"] == "Math"
    assert len(data["questions"]["questions"]) == 1
    assert data["questions"]["questions"][0]["question"] == "What is 1+1?"
    assert data["questions"]["questions"][0]["correctAnswer"] == 1
