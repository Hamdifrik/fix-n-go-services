import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Paperclip, Smile, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  useGetOrCreateConversation, 
  useMessages, 
  useSendMessage,
  useMarkAsRead,
  Message,
} from '@/hooks/useChat';
import { useUploadImage, getImageUrl } from '@/hooks/useUpload';
import socketService from '@/lib/socket';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatWindowProps {
  helperId: string;
  helperName: string;
  helperAvatar?: string;
  serviceId?: string;
  serviceTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({
  helperId,
  helperName,
  helperAvatar,
  serviceId,
  serviceTitle,
  isOpen,
  onClose,
}: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getOrCreateConversation = useGetOrCreateConversation();
  const { data: messagesData, isLoading: messagesLoading } = useMessages(conversationId || '');
  const sendMessageMutation = useSendMessage();
  const markAsRead = useMarkAsRead();
  const uploadImage = useUploadImage();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Initialize conversation and socket
  useEffect(() => {
    if (isOpen && helperId && token) {
      // Connect socket if not connected
      if (!socketService.isConnected()) {
        socketService.connect(token);
      }

      // Get or create conversation
      getOrCreateConversation.mutate(
        { helperId, serviceId },
        {
          onSuccess: (response) => {
            const conv = response.data;
            setConversationId(conv._id);
            socketService.joinConversation(conv._id);
          },
          onError: (error) => {
            toast.error('Erreur lors de la création de la conversation');
          },
        }
      );
    }

    return () => {
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, [isOpen, helperId, serviceId, token]);

  // Load messages when conversation is ready
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // Socket event listeners
  useEffect(() => {
    if (!conversationId) return;

    const unsubNewMessage = socketService.onNewMessage((newMessage) => {
      if (newMessage.conversation === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
        markAsRead.mutate(conversationId);
      }
    });

    const unsubTypingStart = socketService.onTypingStart((data) => {
      if (data.conversationId === conversationId && data.userId !== currentUser._id) {
        setIsTyping(true);
      }
    });

    const unsubTypingStop = socketService.onTypingStop((data) => {
      if (data.conversationId === conversationId && data.userId !== currentUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      unsubNewMessage();
      unsubTypingStart();
      unsubTypingStop();
    };
  }, [conversationId, currentUser._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when conversation opens
  useEffect(() => {
    if (conversationId && isOpen) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId, isOpen]);

  const handleTyping = useCallback(() => {
    if (!conversationId) return;

    socketService.startTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversationId);
    }, 2000);
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!message.trim() || !conversationId) return;

    // Send via WebSocket for real-time
    socketService.sendMessage({
      conversationId,
      content: message.trim(),
      messageType: 'text',
    });

    // Clear typing indicator
    socketService.stopTyping(conversationId);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    try {
      const result = await uploadImage.mutateAsync({
        file,
        category: 'chat',
      });

      socketService.sendMessage({
        conversationId,
        content: 'Image',
        messageType: 'image',
        attachments: [{
          url: result.data.url,
          filename: result.data.filename,
          mimetype: result.data.mimetype,
        }],
      });
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
            {helperAvatar ? (
              <img src={getImageUrl(helperAvatar)} alt={helperName} className="w-full h-full rounded-full object-cover" />
            ) : (
              helperName.charAt(0)
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{helperName}</p>
            {serviceTitle && (
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {serviceTitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">Démarrez la conversation!</p>
            <p className="text-xs mt-1">Envoyez un message à {helperName}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.sender._id === currentUser._id;
              return (
                <div
                  key={msg._id}
                  className={cn(
                    "flex",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    {msg.messageType === 'image' && msg.attachments?.[0] && (
                      <img
                        src={getImageUrl(msg.attachments[0].url)}
                        alt="Image"
                        className="rounded-lg max-w-full mb-2"
                      />
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-1",
                      isOwn ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-[10px]",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatTime(msg.createdAt)}
                      </span>
                      {isOwn && (
                        msg.isRead ? (
                          <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                        ) : (
                          <Check className="w-3 h-3 text-primary-foreground/70" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez un message..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() || !conversationId}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
