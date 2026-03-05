# SmartTutor Frontend Documentation

A modern, high-performance React application designed for AI-powered learning. Built with TypeScript, Vite, and Tailwind CSS, the frontend provides a seamless interface for generating study materials, practice problems, and interactive quizzes.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)
- **State Management**:
  - **Server State**: [TanStack React Query v5](https://tanstack.com/query/latest) (Caching, synchronization, and data fetching)
  - **Auth State**: React Context API
- **API Client**: [Axios](https://axios-http.com/) with centralized interceptors
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content Rendering**: 
  - [React Markdown](https://github.com/remarkjs/react-markdown) for AI responses
  - [KaTeX](https://katex.org/) for high-quality LaTeX mathematical formulas

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── components/        # Reusable UI components (Shadcn + Custom)
│   │   ├── ui/            # Atomic Radix-based components
│   │   └── Navigation.tsx # Global enhanced navigation bar
│   ├── constants/         # Shared app constants (Subjects, Colors)
│   ├── contexts/          # React Contexts (AuthContext)
│   ├── hooks/             # Custom React Hooks (useAI, useSavedContent)
│   ├── lib/               # Utilities (Formatting, JWT decoding, class merging)
│   ├── pages/             # Main application views/routes
│   ├── services/          # API layer (Axios instance, service classes)
│   ├── types/             # Centralized TypeScript interfaces
│   ├── App.tsx            # Routing and Provider configuration
│   └── main.tsx           # Application entry point
├── public/                # Static assets
└── tailwind.config.ts     # Styling configuration (Typography plugin enabled)
```

---

## 🔐 Authentication & API Management

The application implements a robust, secure authentication system located in `src/services/api.ts`.

### Centralized Axios Instance
All requests flow through a shared `api` instance which handles:
1.  **Request Interceptor**: Automatically attaches the `Authorization: Bearer <token>` header from `localStorage`.
2.  **Proactive Token Refresh**: Decodes the JWT before sending a request. If the token is within **1 minute** of expiring, it triggers a refresh call to `/api/auth/refresh` first.
3.  **Reactive 401 Handling**: If a request fails with a `401 Unauthorized`, it attempts a final refresh.
4.  **Concurrency Locking**: Uses a subscriber queue to ensure that multiple simultaneous requests only trigger **one** refresh call, preventing backend spam.

### Persistence
- **Access Token**: Stored in `localStorage`.
- **Refresh Token**: Managed via secure `HttpOnly` cookies (handled by the browser/backend).

---

## 🚀 Core Features

### 1. Ask AI (`/ask-question`)
- **UI**: Premium two-column layout with a timeline-style step-by-step walkthrough.
- **Logic**: Generates structured explanations for any subject.
- **Extras**: "Copy to Clipboard" functionality and one-click saving to library.

### 2. Practice Arena (`/practice`)
- **UI**: Interactive problem sets with hidden solution toggles.
- **Logic**: Custom problem generation based on specific topics.
- **Support**: Full LaTeX rendering for complex scientific and mathematical problems.

### 3. Knowledge Quiz (`/quiz`)
- **UI**: Modern quiz interface with a dynamic progress bar and celebratory results screen.
- **Feedback**: Detailed performance review highlighting correct and incorrect answers with AI-generated explanations.

### 4. Study Notes (`/study-notes`)
- **UI**: Structured content viewer with bullet-point concepts and "Study Tips" callouts.
- **Persistence**: Ability to save generated guides for long-term review.

### 5. Personal Library (`/saved-content`)
- **Organization**: Tabbed view separating saved questions from study notes.
- **Management**: Full CRUD (View/Delete) capabilities with real-time search and subject filtering.

---

## 🎨 Design Standards

- **Typography**: Uses the `@tailwindcss/typography` (`prose`) plugin for consistent rendering of AI-generated content.
- **Responsiveness**: Fully responsive design (Mobile-first) using Tailwind's grid and flexbox utilities.
- **Visual Hierarchy**: 
  - **Primary**: Blue-600 (Academic/Trust)
  - **Success**: Green-600 (Practice/Correct)
  - **Accent**: Orange-500 (Study/Notes)
  - **Challenge**: Purple-600 (Quiz/Testing)

---

## 🛠️ Development & Tooling

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
*Note: Ensure the backend is running on port 8000 for the Vite proxy to function.*

### Linting & Formatting
The project maintains a **zero-error/zero-warning** linting policy.
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Production Build
```bash
npm run build
```
