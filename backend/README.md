# SmartTutor Backend Documentation

The SmartTutor backend is a robust, asynchronous REST API built with FastAPI. It leverages AI models via LangChain and Groq to provide dynamic tutoring features such as structured explanations, study notes generation, practice problems, and multiple-choice quizzes.

---

## 🏗️ Architecture & Technologies

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Package Manager**: [uv](https://github.com/astral-sh/uv) (Extremely fast Python dependency manager)
- **Database**: SQLite with `aiosqlite` for fully asynchronous I/O
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Async approach using `Mapped` and `mapped_column`)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/) (Strict type checking and environment configuration)
- **Authentication**: JWT (JSON Web Tokens) with Argon2id password hashing via `pwdlib`. Cookie-based refresh token rotation flow.
- **AI Integration**: [LangChain Core](https://python.langchain.com/) combined with `ChatGroq` utilizing structured output schemas.

---

## 📂 Project Structure

```text
backend/
├── Dockerfile             # Multi-stage container build with coverage checks
├── pyproject.toml         # uv dependencies & project metadata
├── uv.lock                # Deterministic dependency lockfile
├── main.py                # FastAPI app initialization, CORS, global exception handlers
├── app/
│   ├── api/
│   │   ├── deps.py        # FastAPI dependency injection (e.g., get_current_user)
│   │   └── routes/        # API endpoints grouped by domain (ask, auth, notes, etc.)
│   ├── core/
│   │   ├── config.py      # Pydantic BaseSettings for environment variables
│   │   ├── exceptions.py  # Custom exception classes (AIGenerationError, etc.)
│   │   ├── logger.py      # Centralized logging configuration
│   │   └── security.py    # JWT generation, validation, and Argon2id hashing
│   ├── db/
│   │   └── db.py          # SQLAlchemy async engine, session maker, base model
│   ├── models/            # SQLAlchemy Database Models
│   │   ├── notes.py       # Note model (User notes storage)
│   │   ├── question.py    # Question model (Saved Q&A)
│   │   └── users.py       # User and RefreshToken models
│   ├── schemas/           # Pydantic models for Requests/Responses
│   └── utils/             # Business logic & External APIs
│       ├── ask_api.py     # AI explanation generation logic
│       ├── groq.py        # ChatGroq LLM instance setup
│       ├── notes_api.py   # AI study notes generation logic
│       ├── practice_api.py# AI practice problems generation logic
│       └── quiz_api.py    # AI quiz generation logic
└── tests/                 # Pytest asynchronous test suite
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the `backend/` directory:

```env
# Database
DATABASE_URL="sqlite+aiosqlite:///./instance/smart-tutor.db"

# JWT Authentication
# Must be at least 32 characters long for HS256 security compliance
JWT_SECRET_KEY="your-very-secure-random-secret-key-here"

# AI Integration
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.12+
- `uv` installed (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

### Setup

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Run the development server:**
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Access API Documentation:**
   Open your browser and navigate to [http://localhost:8000/docs](http://localhost:8000/docs) to view the interactive Swagger UI.

---

## 🐳 Docker Deployment

The `Dockerfile` employs a multi-stage approach ensuring code quality before releasing a lightweight production image.

### Building the Image

When you run the build, it actively runs the Pytest suite. If the code coverage is below **70%**, the build will deliberately fail.

```bash
docker build -t smarttutor-backend .
```

### Running the Container

```bash
docker run -d -p 8000:8000 --env-file .env -v ./instance:/app/instance smarttutor-backend
```

*(Note: In production, it is recommended to use the provided `docker-compose.yml` at the project root.)*

---

## 🧪 Testing

The backend uses `pytest` with `pytest-asyncio` for asynchronous endpoint testing, utilizing an in-memory SQLite database (`sqlite+aiosqlite:///:memory:`) to ensure no side effects on local data.

To run the tests and view coverage:
```bash
uv run pytest --cov=app --cov-report=term-missing
```

---

## 🛡️ Authentication Flow

The API utilizes a secure hybrid JWT approach:
1. **Access Token**: Sent as a standard JSON response upon login/registration. Used by the frontend in the `Authorization: Bearer <token>` header for protected routes. Expires in 10 minutes.
2. **Refresh Token**: Issued simultaneously but stored as an `HttpOnly`, `samesite=lax` Cookie and saved in the `refresh_tokens` database table. Valid for 30 days.

### `/api/auth/refresh`
When the access token expires, the frontend can hit this endpoint. The backend will read the secure cookie, validate it against the database, and issue a fresh access token without requiring user interaction.

### `/api/auth/logout`
Deletes the token from the database and instructs the browser to clear the secure cookies.

---

## 🤖 AI Logic & Exception Handling

All AI interaction logic is located in `app/utils/`. 
We use LangChain's `with_structured_output()` feature powered by Pydantic models. This ensures that the Groq LLM strictly returns structured JSON matching our application types (e.g., `StudyNotes`, `Quiz`).

**Resilience**: 
If the AI hallucinates, times out, or returns a badly formatted schema, the application will raise a custom `AIGenerationError`. 
A global exception handler in `main.py` catches this and gracefully returns a `502 Bad Gateway` to the frontend, preventing silent failures or raw stack traces leaking to the client.

---

## 📝 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register a new user.
- `POST /login` - Login to receive tokens.
- `POST /refresh` - Refresh access token via cookie.
- `POST /logout` - Revoke tokens and clear cookies.
- `GET /me` - Get current authenticated user details.

### AI Tutoring Core
- **Ask (`/api/ask`)**
  - `POST /` - Ask an AI a question.
  - `POST /save` - Save an explanation to DB.
  - `GET /saved` - Get user's saved Q&As.
  - `DELETE /{id}` - Delete a saved Q&A.
- **Notes (`/api/notes`)**
  - `POST /` - Generate study notes on a topic.
  - `POST /save`, `GET /saved`, `DELETE /{id}` - CRUD operations for notes.
- **Practice (`/api/practice`)**
  - `POST /` - Generate practice problems and hidden answers.
- **Quiz (`/api/quiz`)**
  - `POST /generate` - Generate a 5-question multiple choice quiz with structured answers.