import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// WebSocket URL (remove /api if present)
const WS_URL = API_URL.replace('/api', '');

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Conversation methods
  joinConversation(conversationId: string): void {
    this.socket?.emit('conversation:join', conversationId);
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('conversation:leave', conversationId);
  }

  // Message methods
  sendMessage(data: {
    conversationId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
    attachments?: Array<{ url: string; filename: string; mimetype: string }>;
  }): void {
    this.socket?.emit('message:send', data);
  }

  // Typing indicators
  startTyping(conversationId: string): void {
    this.socket?.emit('typing:start', conversationId);
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing:stop', conversationId);
  }

  // Mark messages as read
  markAsRead(conversationId: string): void {
    this.socket?.emit('message:read', { conversationId });
  }

  // Event listeners
  onNewMessage(callback: (message: any) => void): () => void {
    this.socket?.on('message:new', callback);
    return () => this.socket?.off('message:new', callback);
  }

  onMessageNotification(callback: (data: any) => void): () => void {
    const handler = (data: any) => {
      console.log('📨 New message notification:', data);
      callback(data);
    };
    this.socket?.on('message:notification', handler);
    return () => this.socket?.off('message:notification', handler);
  }

  // Notification générale
  onNotification(callback: (data: any) => void): () => void {
    this.socket?.on('notification', callback);
    return () => this.socket?.off('notification', callback);
  }

  onTypingStart(callback: (data: { userId: string; conversationId: string }) => void): () => void {
    this.socket?.on('typing:start', callback);
    return () => this.socket?.off('typing:start', callback);
  }

  onTypingStop(callback: (data: { userId: string; conversationId: string }) => void): () => void {
    this.socket?.on('typing:stop', callback);
    return () => this.socket?.off('typing:stop', callback);
  }

  onMessageRead(callback: (data: { conversationId: string; readBy: string }) => void): () => void {
    this.socket?.on('message:read', callback);
    return () => this.socket?.off('message:read', callback);
  }

  onUserOnline(callback: (data: { userId: string }) => void): () => void {
    this.socket?.on('user:online', callback);
    return () => this.socket?.off('user:online', callback);
  }

  onUserOffline(callback: (data: { userId: string }) => void): () => void {
    this.socket?.on('user:offline', callback);
    return () => this.socket?.off('user:offline', callback);
  }

  onError(callback: (error: { message: string }) => void): () => void {
    this.socket?.on('error', callback);
    return () => this.socket?.off('error', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
