import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface UploadedFile {
  filename: string;
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
}

// Upload single image
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({ file, category = 'general' }: { file: File; category?: string }) => {
      const formData = new FormData();
      // IMPORTANT: ajouter "category" AVANT le fichier pour que multer le voie dans destination()
      formData.append('category', category);
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
  });
};

// Upload multiple images
export const useUploadImages = () => {
  return useMutation({
    mutationFn: async ({ files, category = 'general' }: { files: File[]; category?: string }) => {
      const formData = new FormData();
      // IMPORTANT: ajouter "category" AVANT les fichiers pour que multer le voie dans destination()
      formData.append('category', category);
      files.forEach((file) => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/multiple`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
  });
};

// Delete image
export const useDeleteImage = () => {
  return useMutation({
    mutationFn: async ({ filename, category = 'general' }: { filename: string; category?: string }) => {
      const response = await api.delete('/upload', {
        data: { filename, category },
      });
      return response.data;
    },
  });
};

// Get full image URL
export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) {
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${path}`;
  }
  return path;
};
