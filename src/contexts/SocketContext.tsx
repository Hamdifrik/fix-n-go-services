import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

interface SocketContextType {
  isConnected: boolean;
  unreadMessages: number;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = socketService.connect(token);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Écouter les nouvelles notifications de message
    socketService.onMessageNotification((data) => {
      // Incrémenter le compteur de messages non lus
      setUnreadMessages((prev) => prev + 1);

      // Invalider le cache des conversations pour rafraîchir
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

      // Afficher une notification toast
      toast({
        title: `Nouveau message de ${data.senderName || 'Un utilisateur'}`,
        description: data.content?.substring(0, 50) + (data.content?.length > 50 ? '...' : ''),
        duration: 5000,
      });

      // Notification navigateur si permission accordée
      if (Notification.permission === 'granted') {
        new Notification(`Nouveau message de ${data.senderName || 'Quelqu\'un'}`, {
          body: data.content?.substring(0, 100),
          icon: '/favicon.ico',
        });
      }
    });

    // Écouter les nouveaux messages en temps réel
    socketService.onNewMessage((message: any) => {
      const convId = message?.conversation?._id || message?.conversation || message?.conversationId;
      if (convId) {
        queryClient.invalidateQueries({ queryKey: ['messages', convId] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });
  }, [queryClient, toast]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, []);

  // Demander la permission pour les notifications au montage
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-connect si un token existe
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Réinitialiser le compteur quand on lit les messages
  const resetUnread = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, unreadMessages, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
