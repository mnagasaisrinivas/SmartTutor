
export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface RefreshResponse {
  msg?: string;
  token?: string;
}

export interface QuestionRequest {
  question: string;
  subject: string;
}

export interface PracticeProblemsRequest {
  subject: string;
  topic: string;
}

export interface StudyNotesRequest {
  topic: string;
  subject: string;
}

export interface QuizRequest {
  subject: string;
  topic?: string;
}

export interface SaveQuestionRequest {
  subject: string;
  question: string;
  answer_steps: string[];
  answer_summary: string;
}

export interface SaveNotesRequest {
  subject: string;
  topic: string;
  content: {
    heading: string;
    bullet_points: string[];
  };
}

export interface SavedQuestion {
  id: number;
  subject: string;
  question_text: string;
  answer_steps: string[];
  answer_summary: string;
  created_at: string;
}

export interface SavedNote {
  id: number;
  subject: string;
  topic: string;
  heading: string;
  bullet_points: string[];
  created_at: string;
}

export interface QuestionResponse {
  subject: string;
  question: string;
  explanation: {
    title?: string;
    steps?: Array<string>;
    summary?: string;
  };
}

export interface PracticeProblemsResponse {
  subject: string;
  topic: string;
  problems: {
    practice_problems: Array<string>;
    explanations: Array<string>;
  };
}

export interface StudyNotesResponse {
  topic: string;
  subject: string;
  content: {
    heading: string;
    bullet_points: Array<string>;
  };
}

export interface QuizResponse {
  subject: string;
  questions: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      id: number;
    }>;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
