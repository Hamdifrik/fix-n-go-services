import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  attachments: Array<{
    url: string;
    filename: string;
    mimetype: string;
  }>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  }>;
  service?: {
    _id: string;
    title: string;
  };
  lastMessage?: Message;
  lastMessageAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get or create conversation
export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { helperId: string; serviceId?: string }) => {
      const response = await api.post('/chat/conversations', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Get all conversations
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/chat/conversations');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Get messages for a conversation
export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      return response.data;
    },
    enabled: !!conversationId,
  });
};

// Send message (REST fallback)
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      conversationId: string;
      content: string;
      messageType?: 'text' | 'image' | 'file';
      attachments?: Array<{ url: string; filename: string; mimetype: string }>;
    }) => {
      const response = await api.post('/chat/messages', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await api.put(`/chat/conversations/${conversationId}/read`);
      return response.data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const response = await api.get('/chat/unread');
      return response.data;
    },
    refetchInterval: 30000,
  });
};
