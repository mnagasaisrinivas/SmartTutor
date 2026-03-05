
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { aiAPI, QuestionResponse, PracticeProblemsResponse, StudyNotesResponse, QuizResponse,
         QuestionRequest, PracticeProblemsRequest, StudyNotesRequest, QuizRequest,
         SaveQuestionRequest, SaveNotesRequest } from '@/services/aiAPI';
import { toast } from 'sonner';

export const useGenerateExplanation = () : UseMutationResult<QuestionResponse, Error, QuestionRequest> => {
  return useMutation({
    mutationFn: ({ question, subject }: { question: string; subject: string }) =>
      aiAPI.generateExplanation({ question, subject }),
    onSuccess: () => {
      toast.success("Explanation generated successfully!");
    },
    onError: (error: any) => {
      console.error('Explanation generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate explanation');
    },
  });
};

export const useGeneratePracticeProblems = () : UseMutationResult<PracticeProblemsResponse, Error, PracticeProblemsRequest> => {
  return useMutation({
    mutationFn: ({ subject, topic }: { subject: string; topic: string }) =>
      aiAPI.generatePracticeProblems({ subject, topic }),
    onSuccess: () => {
      toast.success("Practice problems generated successfully!");
    },
    onError: (error: any) => {
      console.error('Practice problems generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate practice problems');
    },
  });
};

export const useGenerateStudyNotes = () : UseMutationResult<StudyNotesResponse, Error, StudyNotesRequest> => {
  return useMutation({
    mutationFn: ({ topic, subject }: { topic: string; subject: string }) =>
      aiAPI.generateStudyNotes({ topic, subject }),
    onSuccess: () => {
      toast.success("Study notes generated successfully!");
    },
    onError: (error: any) => {
      console.error('Study notes generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate study notes');
    },
  });
};

export const useGenerateQuiz = () : UseMutationResult<QuizResponse, Error, QuizRequest> => {
  return useMutation({
    mutationFn: ({ subject, topic }: { subject: string, topic?: string }) =>
      aiAPI.generateQuiz({ subject, topic }),
    onSuccess: () => {
      toast.success("Quiz generated successfully!");
    },
    onError: (error: any) => {
      console.error('Quiz generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate quiz');
    },
  });
};

export const useSaveQuestion = () : UseMutationResult<{ message: string }, Error, SaveQuestionRequest> => {
  return useMutation({
    mutationFn: (data: SaveQuestionRequest) => aiAPI.saveQuestion(data),
    onSuccess: () => {
      toast.success("Question saved successfully!");
    },
    onError: (error: any) => {
      console.error('Save question failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save question');
    },
  });
};

export const useSaveNotes = () : UseMutationResult<{ message: string }, Error, SaveNotesRequest> => {
  return useMutation({
    mutationFn: (data: SaveNotesRequest) => aiAPI.saveNotes(data),
    onSuccess: () => {
      toast.success("Notes saved successfully!");
    },
    onError: (error: any) => {
      console.error('Save notes failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save notes');
    },
  });
};
