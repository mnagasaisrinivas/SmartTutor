# SmartTutor 🎓

SmartTutor is a comprehensive, AI-powered tutoring platform designed to provide students with instant, high-quality learning assistance. From step-by-step explanations to customized practice sets and quizzes, SmartTutor leverages advanced AI models to make learning more accessible and effective.

---

## 🌟 Core Features

- **Ask AI**: Get detailed, step-by-step walkthroughs for complex questions in any subject. Supports full LaTeX rendering for mathematics and science.
- **Practice Arena**: Generate custom-tailored practice problems based on specific topics to reinforce learning.
- **Knowledge Quiz**: Challenge yourself with AI-generated multiple-choice quizzes featuring dynamic progress tracking and performance reviews.
- **Study Notes**: Instantly create structured, comprehensive study guides from any topic.
- **Personal Library**: Save your generated explanations and notes for easy access and long-term review.

---

## 🏗️ Architecture & Technologies

### Backend ([FastAPI](https://fastapi.tiangolo.com/))
- **Language**: Python 3.12+
- **Manager**: [uv](https://github.com/astral-sh/uv) (Extremely fast dependency management)
- **Database**: SQLite with `aiosqlite` for asynchronous I/O.
- **ORM**: SQLAlchemy 2.0.
- **AI Integration**: LangChain Core with Groq LLM.
- **Auth**: Secure JWT-based system with cookie-backed refresh token rotation and proactive frontend refreshing.

### Frontend ([React](https://react.dev/))
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS & Shadcn UI for a premium, modern aesthetic.
- **State Management**: TanStack React Query v5 for efficient server-state handling.
- **Math Rendering**: React Markdown & KaTeX for beautiful academic formatting.

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Recommended for production)
- [Python 3.12+](https://www.python.org/) & [uv](https://docs.astral.sh/uv/getting-started/installation/) (For local backend dev)
- [Node.js 20+](https://nodejs.org/) & [npm](https://www.npmjs.com/) (For local frontend dev)

### 🐋 Deployment with Docker (Fastest)

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd SmartTutor
   ```

2. Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="sqlite+aiosqlite:///./instance/smart-tutor.db"
   JWT_SECRET_KEY="your-random-secret-key-at-least-32-chars"
   GROQ_API_KEY="gsk_your_groq_api_key"
   INITIALIZE_DB="true"
   ```

3. Start the application:
   ```bash
   docker-compose up -d --build
   ```
   The application will be live at `http://localhost`.

---

### 💻 Local Development

#### Backend Setup
1. `cd backend`
2. `uv sync`
3. `uv run python main.py` (Runs on port 8000)

#### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 8080)

---

## 📂 Project Structure

```text
SmartTutor/
├── backend/               # FastAPI application
│   ├── app/               # Core logic, models, and routes
│   └── tests/             # Async pytest suite
├── frontend/              # React application
│   ├── src/               # Components, pages, and hooks
│   └── public/            # Static assets
├── docker-compose.yml     # Multi-container orchestration
└── nginx.conf             # Production Nginx configuration & API proxy
```

---

## 🧪 Testing

### Backend
```bash
cd backend
uv run pytest --cov=app
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
