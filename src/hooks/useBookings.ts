import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useBookings = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (bookingData: {
      serviceId: string;
      scheduledDate: string;
      address: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
      };
      notes?: string;
    }) => bookingsApi.create(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Réservation confirmée !',
        description: 'Vous recevrez une confirmation par email.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer la réservation',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      const statusMessages: Record<string, string> = {
        confirmed: 'Réservation acceptée',
        'in-progress': 'Intervention en cours',
        completed: 'Intervention terminée',
      };
      
      toast({
        title: statusMessages[status] || 'Statut mis à jour',
        description: 'Le statut de la réservation a été modifié.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Réservation annulée',
        description: "La réservation a été annulée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || "Impossible d'annuler la réservation",
        variant: 'destructive',
      });
    },
  });
};
