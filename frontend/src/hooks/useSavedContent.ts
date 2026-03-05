
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '@/services/aiAPI';
import { toast } from 'sonner';

export const useSavedQuestions = () => {
  return useQuery({
    queryKey: ['savedQuestions'],
    queryFn: () => aiAPI.getSavedQuestions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSavedNotes = () => {
  return useQuery({
    queryKey: ['savedNotes'],
    queryFn: () => aiAPI.getSavedNotes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => aiAPI.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQuestions'] });
      toast.success("Question deleted successfully");
    },
    onError: (error: Error) => {
      console.error('Delete question failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete question');
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => aiAPI.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedNotes'] });
      toast.success("Note deleted successfully");
    },
    onError: (error: Error) => {
      console.error('Delete note failed:', error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete note');
    },
  });
};
