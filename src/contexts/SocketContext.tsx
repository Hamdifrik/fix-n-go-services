import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socketService from '@/lib/socket';
import { toast } from 'sonner';

// Notification sound
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore audio play errors (autoplay restrictions)
    });
  } catch (e) {
    // Audio not supported
  }
};

interface SocketContextType {
  isConnected: boolean;
  unreadMessages: number;
  onlineUsers: Set<string>;
  connect: () => void;
  disconnect: () => void;
  resetUnread: () => void;
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
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const cleanupRef = useRef<(() => void)[]>([]);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = socketService.connect(token);

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // User online/offline events
    const unsubOnline = socketService.onUserOnline(({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    const unsubOffline = socketService.onUserOffline(({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Message notification (for messages received while not in conversation)
    const unsubNotification = socketService.onMessageNotification((data) => {
      setUnreadMessages(prev => prev + 1);
      
      // Invalidate caches
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Play sound
      playNotificationSound();

      // Show toast notification
      toast.message(`Nouveau message de ${data.senderName || 'Quelqu\'un'}`, {
        description: data.content?.substring(0, 60) + (data.content?.length > 60 ? '...' : ''),
        action: {
          label: 'Voir',
          onClick: () => {
            window.location.href = `/messages?conversation=${data.conversationId}`;
          },
        },
      });

      // Browser notification if permitted
      if (Notification.permission === 'granted' && document.hidden) {
        const notification = new Notification(`Message de ${data.senderName}`, {
          body: data.content?.substring(0, 100),
          icon: '/favicon.ico',
          tag: data.conversationId,
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = `/messages?conversation=${data.conversationId}`;
        };
      }
    });

    // New message event (for real-time updates in active conversation)
    const unsubNewMessage = socketService.onNewMessage((message) => {
      const convId = typeof message.conversation === 'string' 
        ? message.conversation 
        : message.conversation?._id;
      
      if (convId) {
        queryClient.invalidateQueries({ queryKey: ['messages', convId] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    // Error handling
    const unsubError = socketService.onError((error) => {
      console.error('Socket error:', error.message);
      toast.error('Erreur de connexion: ' + error.message);
    });

    // Store cleanup functions
    cleanupRef.current = [
      unsubOnline,
      unsubOffline,
      unsubNotification,
      unsubNewMessage,
      unsubError,
    ];

  }, [queryClient]);

  const disconnect = useCallback(() => {
    // Run all cleanup functions
    cleanupRef.current.forEach(cleanup => cleanup());
    cleanupRef.current = [];
    
    socketService.disconnect();
    setIsConnected(false);
    setOnlineUsers(new Set());
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-connect on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Listen for login/logout events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (e.newValue) {
          connect();
        } else {
          disconnect();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [connect, disconnect]);

  return (
    <SocketContext.Provider value={{ 
      isConnected, 
      unreadMessages, 
      onlineUsers,
      connect, 
      disconnect,
      resetUnread,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
