import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Loader2,
  Image as ImageIcon,
  Circle,
  Phone,
  Video,
  MoreVertical,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  useMessages, 
  useMarkAsRead,
  Message,
  Conversation,
} from '@/hooks/useChat';
import { useUploadImage, getImageUrl } from '@/hooks/useUpload';
import socketService from '@/lib/socket';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ChatPanelProps {
  conversation: Conversation;
  currentUserId: string;
  onlineUsers: Set<string>;
}

export const ChatPanel = ({ 
  conversation, 
  currentUserId,
  onlineUsers 
}: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: messagesData, isLoading } = useMessages(conversation._id);
  const markAsRead = useMarkAsRead();
  const uploadImage = useUploadImage();

  const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);
  const isOtherOnline = otherParticipant && onlineUsers.has(otherParticipant._id);

  // Load messages from API
  useEffect(() => {
    if (messagesData?.data) {
      setLocalMessages(messagesData.data);
    }
  }, [messagesData]);

  // Join conversation room on mount
  useEffect(() => {
    socketService.joinConversation(conversation._id);
    markAsRead.mutate(conversation._id);

    return () => {
      socketService.leaveConversation(conversation._id);
    };
  }, [conversation._id]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      // Check if message belongs to this conversation
      const msgConvId = typeof newMessage.conversation === 'string' 
        ? newMessage.conversation 
        : newMessage.conversation?._id;
      
      if (msgConvId === conversation._id) {
        setLocalMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        
        // Mark as read if we're in the conversation
        markAsRead.mutate(conversation._id);
      }
    };

    const handleTypingStart = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversation._id && data.userId !== currentUserId) {
        setIsTyping(true);
        setTypingUser(data.userId);
      }
    };

    const handleTypingStop = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversation._id && data.userId !== currentUserId) {
        setIsTyping(false);
        setTypingUser(null);
      }
    };

    const handleMessageRead = (data: { conversationId: string; readBy: string }) => {
      if (data.conversationId === conversation._id && data.readBy !== currentUserId) {
        setLocalMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: msg.sender._id === currentUserId ? true : msg.isRead
        })));
      }
    };

    const unsubNewMessage = socketService.onNewMessage(handleNewMessage);
    const unsubTypingStart = socketService.onTypingStart(handleTypingStart);
    const unsubTypingStop = socketService.onTypingStop(handleTypingStop);
    const unsubMessageRead = socketService.onMessageRead(handleMessageRead);

    return () => {
      unsubNewMessage();
      unsubTypingStart();
      unsubTypingStop();
      unsubMessageRead();
    };
  }, [conversation._id, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation._id]);

  const handleTyping = useCallback(() => {
    socketService.startTyping(conversation._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversation._id);
    }, 2000);
  }, [conversation._id]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    socketService.sendMessage({
      conversationId: conversation._id,
      content: message.trim(),
      messageType: 'text',
    });

    socketService.stopTyping(conversation._id);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessage('');
  }, [message, conversation._id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage.mutateAsync({ file, category: 'chat' });

      socketService.sendMessage({
        conversationId: conversation._id,
        content: '📷 Image',
        messageType: 'image',
        attachments: [{
          url: result.data.url,
          filename: result.data.filename,
          mimetype: result.data.mimetype,
        }],
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'image");
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

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    return d.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Group messages by date
  const groupedMessages = localMessages.reduce((groups: Record<string, Message[]>, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherParticipant?.avatar ? getImageUrl(otherParticipant.avatar) : undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                {otherParticipant?.firstName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className={cn(
              "absolute bottom-0 right-0 w-3 h-3 border-2 border-card rounded-full",
              isOtherOnline ? "bg-secondary" : "bg-muted-foreground"
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {otherParticipant?.firstName} {otherParticipant?.lastName}
              </h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {otherParticipant?.role === 'helper' ? 'Prestataire' : 'Client'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Circle className={cn(
                "w-2 h-2 fill-current",
                isOtherOnline ? "text-secondary" : "text-muted-foreground"
              )} />
              {isOtherOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>

        {conversation.service && (
          <Badge variant="secondary" className="hidden sm:flex">
            {conversation.service.title}
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium">Démarrez la conversation</p>
            <p className="text-sm">Envoyez un message à {otherParticipant?.firstName}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2">
                    {formatDate(msgs[0].createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {msgs.map((msg, index) => {
                    const isOwn = msg.sender._id === currentUserId;
                    const showAvatar = !isOwn && (
                      index === 0 || 
                      msgs[index - 1]?.sender._id !== msg.sender._id
                    );

                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex gap-2",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isOwn && (
                          <div className="w-8 flex-shrink-0">
                            {showAvatar && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={msg.sender.avatar ? getImageUrl(msg.sender.avatar) : undefined} />
                                <AvatarFallback className="text-xs bg-muted">
                                  {msg.sender.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-card border border-border rounded-bl-md"
                          )}
                        >
                          {msg.messageType === 'image' && msg.attachments?.[0] && (
                            <img
                              src={getImageUrl(msg.attachments[0].url)}
                              alt="Image"
                              className="rounded-lg max-w-full mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(getImageUrl(msg.attachments[0].url), '_blank')}
                            />
                          )}
                          
                          {msg.content && msg.content !== '📷 Image' && (
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          )}

                          <div className={cn(
                            "flex items-center gap-1.5 mt-1",
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
                                <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-primary-foreground/70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={otherParticipant?.avatar ? getImageUrl(otherParticipant.avatar) : undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {otherParticipant?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadImage.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            {uploadImage.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </Button>

          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-muted border-0 focus-visible:ring-1"
          />

          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
