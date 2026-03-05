
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '@/services/aiAPI';
import { 
  QuestionResponse, 
  PracticeProblemsResponse, 
  StudyNotesResponse, 
  QuizResponse,
  QuestionRequest, 
  PracticeProblemsRequest, 
  StudyNotesRequest, 
  QuizRequest,
  SaveQuestionRequest, 
  SaveNotesRequest 
} from '@/types';
import { toast } from 'sonner';

export const useGenerateExplanation = () : UseMutationResult<QuestionResponse, Error, QuestionRequest> => {
  return useMutation({
    mutationFn: (data: QuestionRequest) =>
      aiAPI.generateExplanation(data),
    onSuccess: () => {
      toast.success("Explanation generated successfully!");
    },
    onError: (error: Error) => {
      console.error('Explanation generation failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to generate explanation');
    },
  });
};

export const useGeneratePracticeProblems = () : UseMutationResult<PracticeProblemsResponse, Error, PracticeProblemsRequest> => {
  return useMutation({
    mutationFn: (data: PracticeProblemsRequest) =>
      aiAPI.generatePracticeProblems(data),
    onSuccess: () => {
      toast.success("Practice problems generated successfully!");
    },
    onError: (error: Error) => {
      console.error('Practice problems generation failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to generate practice problems');
    },
  });
};

export const useGenerateStudyNotes = () : UseMutationResult<StudyNotesResponse, Error, StudyNotesRequest> => {
  return useMutation({
    mutationFn: (data: StudyNotesRequest) =>
      aiAPI.generateStudyNotes(data),
    onSuccess: () => {
      toast.success("Study notes generated successfully!");
    },
    onError: (error: Error) => {
      console.error('Study notes generation failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to generate study notes');
    },
  });
};

export const useGenerateQuiz = () : UseMutationResult<QuizResponse, Error, QuizRequest> => {
  return useMutation({
    mutationFn: (data: QuizRequest) =>
      aiAPI.generateQuiz(data),
    onSuccess: () => {
      toast.success("Quiz generated successfully!");
    },
    onError: (error: Error) => {
      console.error('Quiz generation failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to generate quiz');
    },
  });
};

export const useSaveQuestion = () : UseMutationResult<{ message: string }, Error, SaveQuestionRequest> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SaveQuestionRequest) => aiAPI.saveQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQuestions'] });
      toast.success("Question saved successfully!");
    },
    onError: (error: Error) => {
      console.error('Save question failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to save question');
    },
  });
};

export const useSaveNotes = () : UseMutationResult<{ message: string }, Error, SaveNotesRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveNotesRequest) => aiAPI.saveNotes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedNotes'] });
      toast.success("Notes saved successfully!");
    },
    onError: (error: Error) => {
      console.error('Save notes failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to save notes');
    },
  });
};
