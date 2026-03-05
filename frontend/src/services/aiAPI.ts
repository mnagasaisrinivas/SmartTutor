
import { api } from './api';
import { 
  QuestionRequest, 
  QuestionResponse, 
  PracticeProblemsRequest, 
  PracticeProblemsResponse, 
  StudyNotesRequest, 
  StudyNotesResponse, 
  QuizRequest, 
  QuizResponse, 
  SaveQuestionRequest, 
  SaveNotesRequest, 
  SavedQuestion, 
  SavedNote 
} from "@/types";

class AIAPI {
  async generateExplanation(data: QuestionRequest): Promise<QuestionResponse> {
    const response = await api.post("/api/ask", data);
    return response.data;
  }

  async generatePracticeProblems(
    data: PracticeProblemsRequest,
  ): Promise<PracticeProblemsResponse> {
    const response = await api.post("/api/practice", data);
    return response.data;
  }

  async generateStudyNotes(
    data: StudyNotesRequest,
  ): Promise<StudyNotesResponse> {
    const response = await api.post("/api/notes", data);
    return response.data;
  }

  async generateQuiz(data: QuizRequest): Promise<QuizResponse> {
    const response = await api.post("/api/quiz/generate", data);
    return response.data;
  }

  async saveQuestion(data: SaveQuestionRequest): Promise<{ message: string }> {
    const response = await api.post("/api/ask/save", data);
    return response.data;
  }

  async saveNotes(data: SaveNotesRequest): Promise<{ message: string }> {
    const response = await api.post("/api/notes/save", data);
    return response.data;
  }

  async getSavedQuestions(): Promise<SavedQuestion[]> {
    const response = await api.get("/api/ask/saved");
    return response.data;
  }

  async getSavedNotes(): Promise<SavedNote[]> {
    const response = await api.get("/api/notes/saved");
    return response.data;
  }

  async deleteQuestion(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/api/ask/${id}`);
    return response.data;
  }

  async deleteNote(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data;
  }
}

export const aiAPI = new AIAPI();
