import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "";

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

class AIAPI {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
    });

    // Add authorization header if token exists
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  async generateExplanation(data: QuestionRequest): Promise<QuestionResponse> {
    const response = await this.axiosInstance.post("/api/ask/", data);
    console.log(response.data);
    return response.data;
  }

  async generatePracticeProblems(
    data: PracticeProblemsRequest,
  ): Promise<PracticeProblemsResponse> {
    const response = await this.axiosInstance.post("/api/practice/", data);
    return response.data;
  }

  async generateStudyNotes(
    data: StudyNotesRequest,
  ): Promise<StudyNotesResponse> {
    const response = await this.axiosInstance.post("/api/notes/", data);
    return response.data;
  }

  async generateQuiz(data: QuizRequest): Promise<QuizResponse> {
    const response = await this.axiosInstance.post("/api/quiz/generate", data);
    return response.data;
  }

  async saveQuestion(data: SaveQuestionRequest): Promise<{ message: string }> {
    const response = await this.axiosInstance.post("/api/ask/save", data);
    return response.data;
  }

  async saveNotes(data: SaveNotesRequest): Promise<{ message: string }> {
    const response = await this.axiosInstance.post("/api/notes/save", data);
    return response.data;
  }

  async getSavedQuestions(): Promise<SavedQuestion[]> {
    const response = await this.axiosInstance.get("/api/ask/saved");
    return response.data;
  }

  async getSavedNotes(): Promise<SavedNote[]> {
    const response = await this.axiosInstance.get("/api/notes/saved");
    return response.data;
  }

  async deleteQuestion(id: number): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/api/ask/${id}`);
    return response.data;
  }

  async deleteNote(id: number): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete(`/api/notes/${id}`);
    return response.data;
  }
}

export const aiAPI = new AIAPI();
