import { useState } from 'react';
import { Bell, MessageCircle, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSocket } from '@/contexts/SocketContext';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { unreadMessages } = useSocket();
  const { data: notificationsResponse, isLoading } = useNotifications({ limit: 10 });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  // Handle both API response formats
  const notifications = Array.isArray(notificationsResponse?.data) 
    ? notificationsResponse.data 
    : notificationsResponse?.data?.notifications || [];
  const unreadCount = (notifications.filter((n: any) => !n.read).length || 0) + unreadMessages;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'booking':
        return <Bell className="w-4 h-4 text-secondary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
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
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Check className="w-3 h-3 mr-1" />
              Tout marquer lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Chargement...
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
                        !notification.read && "font-medium"
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
