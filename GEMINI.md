# SmartTutor

A full-stack application for AI-powered tutoring, including question answering, practice problems, study notes, and quizzes.

## Project Structure

- `backend/`: FastAPI backend
  - `app/`: Application logic (api, core, db, models, schemas, utils)
  - `tests/`: Backend tests
  - `Dockerfile`: Container configuration
- `frontend/`: Vite + React + TypeScript + TailwindCSS + Shadcn UI
  - `src/`: Source code (components, contexts, hooks, pages, services)
  - `Dockerfile`: Container configuration
  - `nginx.conf`: Nginx configuration for serving the frontend and proxying API calls
- `docker-compose.yml`: Multi-container deployment configuration

## Getting Started

### Local Development (Backend)
1. Navigate to `backend/`
2. Install dependencies: `uv sync`
3. Run migrations/start app: `uv run main.py`

### Local Development (Frontend)
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

### Docker Deployment
```bash
docker-compose up --build
```

## Backend API Endpoints

- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login (JSON)
- `GET /api/auth/me`: Get current user info
- `POST /api/ask/`: Generate AI explanation for a question
- `POST /api/ask/save`: Save a question and explanation
- `GET /api/ask/saved`: Retrieve saved questions
- `POST /api/notes/`: Generate AI study notes
- `POST /api/notes/save`: Save study notes
- `GET /api/notes/saved`: Retrieve saved notes
- `POST /api/practice/`: Generate practice problems
- `POST /api/quiz/generate`: Generate a multiple-choice quiz

## Testing

### Backend
```bash
cd backend
uv run pytest
```

### Frontend
- TODO: Add Vitest/Cypress tests

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL`: SQLAlchemy database URL (e.g., `sqlite+aiosqlite:///./instance/smart-tutor.db`)
- `JWT_SECRET_KEY`: Secret for JWT signing
- `OPENROUTER_API_KEY`: API key for AI generation via OpenRouter
