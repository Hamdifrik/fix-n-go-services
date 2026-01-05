import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi, Service } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useServices = (params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(id),
    enabled: !!id,
  });
};

export const useMyServices = () => {
  return useQuery({
    queryKey: ['my-services'],
    queryFn: () => servicesApi.getMyServices(),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (serviceData: {
      title: string;
      description: string;
      category: string;
      price: number;
      duration: number;
      images?: string[];
      tags?: string[];
    }) => servicesApi.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service créé !',
        description: 'Votre service est maintenant visible dans le catalogue.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer le service',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service mis à jour !',
        description: 'Les modifications ont été sauvegardées.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le service',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service supprimé',
        description: 'Le service a été supprimé avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le service',
        variant: 'destructive',
      });
    },
  });
};
