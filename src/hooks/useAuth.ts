import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setToken(token);

        toast({
          title: 'Connexion réussie',
          description: `Bienvenue ${user.firstName}!`,
        });

        // Redirect based on role
        if (user.role === 'helper') {
          navigate('/helper/dashboard');
        } else {
          navigate('/dashboard');
        }

        return { success: true };
      }

      return { success: false, error: response.message };
    } catch (error: any) {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'client' | 'helper';
    expertise?: string[];
    hourlyRate?: number;
  }) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setToken(token);

        toast({
          title: 'Inscription réussie',
          description: `Bienvenue ${user.firstName}!`,
        });

        // Redirect based on role
        if (user.role === 'helper') {
          navigate('/helper/dashboard');
        } else {
          navigate('/dashboard');
        }

        return { success: true };
      }

      return { success: false, error: response.message };
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  }, [navigate]);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      const response = await authApi.updateProfile(profileData);
      
      if (response.success && response.data) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations ont été sauvegardées.',
        });

        return { success: true };
      }

      return { success: false, error: response.message };
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  }, [toast]);

  const isAuthenticated = !!token && !!user;
  const isHelper = user?.role === 'helper';
  const isClient = user?.role === 'client';

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isHelper,
    isClient,
    login,
    register,
    logout,
    updateProfile,
  };
};
