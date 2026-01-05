import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useHelpers = (params?: {
  expertise?: string;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['helpers', params],
    queryFn: () => usersApi.getHelpers(params),
  });
};

export const useHelper = (id: string) => {
  return useQuery({
    queryKey: ['helper', id],
    queryFn: () => usersApi.getHelperById(id),
    enabled: !!id,
  });
};
