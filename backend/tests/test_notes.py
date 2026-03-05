import pytest
from httpx import AsyncClient
from unittest.mock import patch
from app.utils.notes_api import StudyNotes

@pytest.fixture
async def auth_headers(client: AsyncClient):
    res = await client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "notes@example.com",
            "password": "password123"
        },
    )
    return {"Authorization": f"Bearer {res.json()['token']}"}

@pytest.mark.asyncio
@patch("app.api.routes.notes.get_study_notes")
async def test_generate_notes(mock_get_notes, client: AsyncClient, auth_headers: dict):
    mock_get_notes.return_value = StudyNotes(
        heading="History Basics",
        bullet_points=["Point 1", "Point 2"]
    )

    response = await client.post(
        "/api/notes/",
        json={"subject": "History", "topic": "WW2"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject"] == "History"
    assert data["topic"] == "WW2"
    assert data["content"]["heading"] == "History Basics"

@pytest.mark.asyncio
async def test_save_and_get_notes(client: AsyncClient, auth_headers: dict):
    # Save note
    save_response = await client.post(
        "/api/notes/save",
        json={
            "subject": "History",
            "topic": "WW2",
            "content": {
                "heading": "History Basics",
                "bullet_points": ["Point 1", "Point 2"]
            }
        },
        headers=auth_headers
    )
    assert save_response.status_code == 200

    # Get notes
    get_response = await client.get("/api/notes/saved", headers=auth_headers)
    assert get_response.status_code == 200
    data = get_response.json()
    assert len(data) == 1
    assert data[0]["topic"] == "WW2"
    assert data[0]["bullet_points"] == ["Point 1", "Point 2"]

@pytest.mark.asyncio
async def test_delete_note(client: AsyncClient, auth_headers: dict):
    # Save note
    await client.post(
        "/api/notes/save",
        json={
            "subject": "History",
            "topic": "WW2",
            "content": {
                "heading": "History Basics",
                "bullet_points": ["Point 1"]
            }
        },
        headers=auth_headers
    )

    get_response = await client.get("/api/notes/saved", headers=auth_headers)
    note_id = get_response.json()[0]["id"]

    del_response = await client.delete(f"/api/notes/{note_id}", headers=auth_headers)
    assert del_response.status_code == 200

    get_empty_response = await client.get("/api/notes/saved", headers=auth_headers)
    assert len(get_empty_response.json()) == 0
