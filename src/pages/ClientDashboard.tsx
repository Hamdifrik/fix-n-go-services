import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Bell, 
  MessageSquare, 
  User, 
  LogOut,
  Home,
  Package,
  Calendar as CalendarIcon,
  Settings,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceCard from '@/components/services/ServiceCard';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'helper';
}

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  serrurerie: 'Serrurerie',
  chauffage: 'Chauffage',
  climatisation: 'Climatisation',
  menuiserie: 'Menuiserie',
  peinture: 'Peinture',
  menage: 'Ménage',
  jardinage: 'Jardinage',
  mecanique: 'Mécanique',
  vitrerie: 'Vitrerie',
  autre: 'Autre',
  other: 'Autre',
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  'in-progress': 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserData | null>(null);

  // API Calls
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useBookings();
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices({ limit: 4 });

  const bookings = bookingsResponse?.data || [];
  const recommendedServices = (servicesResponse?.data || []).map((service: any) => ({
    id: service._id,
    title: service.title,
    description: service.description,
    category: service.category,
    price: service.price,
    pricingType: 'fixed' as const,
    duration: service.duration,
    rating: service.helper?.rating || 4.5,
    reviewCount: service.helper?.totalReviews || 0,
    images: service.images?.length > 0 ? service.images : ['/placeholder.svg'],
    tags: service.tags || [],
    helperId: typeof service.helper === 'string' ? service.helper : service.helper?._id,
    helper: {
      id: typeof service.helper === 'string' ? service.helper : service.helper?._id || '',
      firstName: service.helper?.firstName || 'Helper',
      lastName: service.helper?.lastName || '',
      rating: service.helper?.rating || 4.5,
      reviewCount: service.helper?.totalReviews || 0,
      completedJobs: 0,
      location: 'France',
      isVerified: service.helper?.isVerified || false,
      responseTime: 30,
    },
    isActive: service.isActive,
    createdAt: new Date(service.createdAt),
  }));

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.role === 'helper') {
          navigate('/helper/dashboard');
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error('Erreur:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return '??';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'bookings', icon: CalendarIcon, label: 'Mes réservations', badge: bookings.length },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 0 },
    { id: 'profile', icon: User, label: 'Profil', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'confirmed': return 'bg-info/10 text-info';
      case 'in-progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-secondary/10 text-secondary';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">FixIt</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground truncate capitalize">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">Mon espace</h1>
            <p className="text-sm text-muted-foreground">Bienvenue, {user.firstName} !</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <Link to="/services">
              <Button variant="hero" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                Trouver un service
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'home' && (
            <>
              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Que cherchez-vous ?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['plomberie', 'electricite', 'menage', 'serrurerie'].map((cat) => (
                    <Link 
                      key={cat}
                      to={`/services?category=${cat}`}
                      className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
                    >
                      <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* My Bookings Preview */}
              {bookings.length > 0 && (
                <div className="bg-card rounded-2xl border border-border mb-8">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Mes réservations</h2>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Voir tout
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {isLoadingBookings ? (
                    <div className="p-5 space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {bookings.slice(0, 2).map((booking: any) => {
                        const service = typeof booking.service === 'string' ? null : booking.service;
                        const helper = typeof booking.helper === 'string' ? null : booking.helper;
                        
                        return (
                          <div 
                            key={booking._id}
                            className="p-5 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={service?.images?.[0] || '/placeholder.svg'}
                                alt={service?.title || 'Service'}
                                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    getStatusColor(booking.status)
                                  )}>
                                    {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                                  </span>
                                </div>
                                <h3 className="font-semibold truncate">{service?.title || 'Service'}</h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    {new Date(booking.scheduledDate).toLocaleDateString('fr-FR')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(booking.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-secondary">{booking.totalPrice}€</p>
                                <p className="text-sm text-muted-foreground">
                                  {helper ? `${helper.firstName} ${helper.lastName?.charAt(0)}.` : 'Helper'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Recommended Services */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Services recommandés</h2>
                  <Link to="/services" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                {isLoadingServices ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-64 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedServices.map((service: any) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service}
                        onBook={() => navigate(`/book/${service.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-card rounded-2xl border border-border">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-semibold">Toutes mes réservations</h2>
              </div>
              
              {isLoadingBookings ? (
                <div className="p-5 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="divide-y divide-border">
                  {bookings.map((booking: any) => {
                    const service = typeof booking.service === 'string' ? null : booking.service;
                    const helper = typeof booking.helper === 'string' ? null : booking.helper;
                    
                    return (
                      <div 
                        key={booking._id}
                        className="p-5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={service?.images?.[0] || '/placeholder.svg'}
                            alt={service?.title || 'Service'}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getStatusColor(booking.status)
                              )}>
                                {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {CATEGORY_LABELS[service?.category] || service?.category || 'Service'}
                              </span>
                            </div>
                            <h3 className="font-semibold">{service?.title || 'Service'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Prestataire: {helper ? `${helper.firstName} ${helper.lastName}` : 'Helper'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(booking.scheduledDate).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(booking.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {booking.address?.city || 'France'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-secondary">{booking.totalPrice}€</p>
                            {booking.status === 'completed' && (
                              <Button variant="outline" size="sm" className="mt-2">
                                <Star className="w-4 h-4 mr-1" />
                                Noter
                              </Button>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button variant="outline" size="sm" className="mt-2">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Contacter
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Aucune réservation</h3>
                  <p className="text-muted-foreground mb-4">
                    Explorez notre catalogue pour trouver le service parfait
                  </p>
                  <Link to="/services">
                    <Button variant="hero">Explorer les services</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-4 z-50">
        {sidebarItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              } else {
                setActiveTab(item.id);
              }
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              activeTab === item.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ClientDashboard;
