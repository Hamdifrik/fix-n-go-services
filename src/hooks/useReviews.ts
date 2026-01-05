import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useHelperReviews = (helperId: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['reviews', helperId, params],
    queryFn: () => reviewsApi.getHelperReviews(helperId, params),
    enabled: !!helperId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reviewData: { bookingId: string; rating: number; comment: string }) =>
      reviewsApi.create(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Avis publié !',
        description: 'Merci pour votre retour.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || "Impossible de publier l'avis",
        variant: 'destructive',
      });
    },
  });
};

export const useRespondToReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ reviewId, response }: { reviewId: string; response: string }) =>
      reviewsApi.respond(reviewId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Réponse publiée !',
        description: 'Votre réponse a été ajoutée.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de publier la réponse',
        variant: 'destructive',
      });
    },
  });
};
