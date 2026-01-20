import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useConversations, useUnreadCount, Conversation, Message } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: conversationsResponse, isLoading } = useConversations();
  const { data: unreadResponse } = useUnreadCount();

  // Get current user from localStorage
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);
  const currentUserId = currentUser?._id;

  const conversations: Conversation[] = conversationsResponse?.data || [];
  const unreadCount = unreadResponse?.data?.count || 0;

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== currentUserId) || conversation.participants[0];
  };

  const handleConversationClick = (conversationId: string) => {
    setOpen(false);
    navigate(`/messages?conversation=${conversationId}`);
  };

  const getLastMessagePreview = (lastMessage?: Message) => {
    if (!lastMessage) return 'Nouvelle conversation';
    
    if (lastMessage.messageType === 'image') {
      return '📷 Image';
    }
    
    return lastMessage.content?.length > 40 
      ? lastMessage.content.substring(0, 40) + '...' 
      : lastMessage.content || 'Pas de message';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-semibold">Messages</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-xs text-primary hover:text-primary/80"
          >
            <Link to="/messages">Voir tout</Link>
          </Button>
        </div>
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Chargement...
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune conversation</p>
              <p className="text-xs mt-1">
                Commencez une conversation depuis un service
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.slice(0, 8).map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                const hasUnread = conversation.lastMessage && !conversation.lastMessage.isRead && 
                  (typeof conversation.lastMessage.sender === 'object' 
                    ? conversation.lastMessage.sender._id !== currentUserId 
                    : conversation.lastMessage.sender !== currentUserId);
                
                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleConversationClick(conversation._id)}
                    className={cn(
                      "p-3 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start",
                      hasUnread && "bg-destructive/5"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherUser?.avatar} alt={otherUser?.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {otherUser?.firstName?.charAt(0) || <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-sm truncate",
                          hasUnread && "font-semibold"
                        )}>
                          {otherUser?.firstName} {otherUser?.lastName}
                        </p>
                        {hasUnread && (
                          <Badge 
                            variant="destructive" 
                            className="h-2 w-2 p-0 rounded-full animate-pulse ml-2"
                          />
                        )}
                      </div>
                      {conversation.service && (
                        <p className="text-xs text-primary/70 truncate">
                          {conversation.service.title}
                        </p>
                      )}
                      <p className={cn(
                        "text-xs mt-0.5 truncate",
                        hasUnread ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {getLastMessagePreview(conversation.lastMessage)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(conversation.lastMessageAt || conversation.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        {conversations.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full text-sm"
              asChild
            >
              <Link to="/messages">
                Voir toutes les conversations
              </Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MessageDropdown;
