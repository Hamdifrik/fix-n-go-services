import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Circle,
  ChevronLeft,
  User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { useConversations, Conversation } from '@/hooks/useChat';
import { useSocket } from '@/contexts/SocketContext';
import { getImageUrl } from '@/hooks/useUpload';
import { cn } from '@/lib/utils';
import ChatPanel from '@/components/chat/ChatPanel';

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const { data: conversationsData, isLoading } = useConversations();
  const conversations = conversationsData?.data || [];
  const { isConnected, onlineUsers } = useSocket();
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Auto-select conversation from URL params
  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (convId && conversations.length > 0) {
      const conv = conversations.find((c: Conversation) => c._id === convId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv: Conversation) => {
    const otherParticipant = conv.participants.find(p => p._id !== currentUser._id);
    const name = `${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setSearchParams({ conversation: conv._id });
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return msgDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    return msgDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== currentUser._id);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  if (!currentUser._id) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 h-screen">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Conversations List - Sidebar */}
          <div className={cn(
            "w-full md:w-96 border-r border-border flex flex-col bg-card",
            selectedConversation && "hidden md:flex"
          )}>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Messages
                </h1>
                <div className="flex items-center gap-2">
                  <Circle className={cn(
                    "w-2 h-2 fill-current",
                    isConnected ? "text-secondary" : "text-muted-foreground"
                  )} />
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? 'Connecté' : 'Hors ligne'}
                  </span>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium mb-1">Aucune conversation</p>
                  <p className="text-sm">
                    Commencez une conversation en contactant un prestataire
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredConversations.map((conv: Conversation) => {
                    const other = getOtherParticipant(conv);
                    const isOnline = other && isUserOnline(other._id);
                    const isSelected = selectedConversation?._id === conv._id;
                    const lastMessage = conv.lastMessage;
                    const unreadCount = (conv as any).unreadCount || 0;

                    return (
                      <button
                        key={conv._id}
                        onClick={() => handleSelectConversation(conv)}
                        className={cn(
                          "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                          isSelected && "bg-primary/5 border-l-2 border-primary"
                        )}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                            {other?.avatar ? (
                              <img 
                                src={getImageUrl(other.avatar)} 
                                alt={other.firstName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>{other?.firstName?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          {/* Online indicator */}
                          <span className={cn(
                            "absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-card rounded-full",
                            isOnline ? "bg-secondary" : "bg-muted-foreground"
                          )} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold truncate">
                                {other?.firstName} {other?.lastName}
                              </span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {other?.role === 'helper' ? 'Prestataire' : 'Client'}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "text-sm truncate pr-2",
                              unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                            )}>
                              {lastMessage?.messageType === 'image' 
                                ? '📷 Image'
                                : lastMessage?.content || 'Nouvelle conversation'
                              }
                            </p>
                            {unreadCount > 0 && (
                              <Badge className="bg-secondary text-secondary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          {conv.service && (
                            <p className="text-xs text-primary mt-1 truncate">
                              {conv.service.title}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Panel */}
          <div className={cn(
            "flex-1 flex flex-col bg-background",
            !selectedConversation && "hidden md:flex"
          )}>
            {selectedConversation ? (
              <>
                {/* Mobile back button */}
                <div className="md:hidden p-4 border-b border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(null);
                      setSearchParams({});
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </div>
                <ChatPanel
                  conversation={selectedConversation}
                  currentUserId={currentUser._id}
                  onlineUsers={onlineUsers}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 opacity-50" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Vos messages</h2>
                  <p className="text-sm max-w-xs">
                    Sélectionnez une conversation pour afficher les messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
