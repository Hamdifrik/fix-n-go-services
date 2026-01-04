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
import { mockServices } from '@/data/mockServices';
import { Booking, BOOKING_STATUS_LABELS, CATEGORY_LABELS } from '@/types/service';
import ServiceCard from '@/components/services/ServiceCard';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'helper';
}

// Réservations du client (simulation)
const clientBookings: (Booking & { helperName: string })[] = [
  {
    id: 'cb1',
    serviceId: '1',
    service: mockServices[0],
    clientId: 'c1',
    helperId: 'h1',
    status: 'accepted',
    scheduledDate: new Date('2024-01-20'),
    scheduledTime: '14:00',
    address: {
      street: '123 rue de la République',
      city: 'Paris',
      postalCode: '75015',
    },
    totalPrice: 50,
    paymentStatus: 'held',
    createdAt: new Date('2024-01-15'),
    helperName: 'Marc D.',
  },
  {
    id: 'cb2',
    serviceId: '2',
    service: mockServices[1],
    clientId: 'c1',
    helperId: 'h2',
    status: 'completed',
    scheduledDate: new Date('2024-01-10'),
    scheduledTime: '10:00',
    address: {
      street: '123 rue de la République',
      city: 'Paris',
      postalCode: '75015',
    },
    totalPrice: 60,
    paymentStatus: 'released',
    createdAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-10'),
    helperName: 'Sophie M.',
  },
];

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Rediriger vers helper dashboard si c'est un helper
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
    { id: 'bookings', icon: CalendarIcon, label: 'Mes réservations', badge: clientBookings.length },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 1 },
    { id: 'profile', icon: User, label: 'Profil', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'accepted': return 'bg-info/10 text-info';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-secondary/10 text-secondary';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Services recommandés
  const recommendedServices = mockServices.slice(0, 4);

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
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">FixIt</span>
          </Link>
        </div>

        {/* Navigation */}
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
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
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
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">Mon espace</h1>
            <p className="text-sm text-muted-foreground">Bienvenue, {user.firstName} !</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <Link to="/services">
              <Button variant="hero" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                Trouver un service
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Quick Actions */}
          {activeTab === 'home' && (
            <>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Que cherchez-vous ?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Plomberie', 'Électricité', 'Ménage', 'Serrurerie'].map((cat) => (
                    <Link 
                      key={cat}
                      to={`/services?category=${cat.toLowerCase()}`}
                      className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
                    >
                      <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <span className="font-medium">{cat}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* My Bookings Preview */}
              {clientBookings.length > 0 && (
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
                  
                  <div className="divide-y divide-border">
                    {clientBookings.slice(0, 2).map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={booking.service.images[0] || '/placeholder.svg'}
                            alt={booking.service.title}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getStatusColor(booking.status)
                              )}>
                                {BOOKING_STATUS_LABELS[booking.status]}
                              </span>
                            </div>
                            <h3 className="font-semibold truncate">{booking.service.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {booking.scheduledDate.toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.scheduledTime}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-secondary">{booking.totalPrice}€</p>
                            <p className="text-sm text-muted-foreground">{booking.helperName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service}
                      onBook={() => navigate(`/book/${service.id}`)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-card rounded-2xl border border-border">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-semibold">Toutes mes réservations</h2>
              </div>
              
              {clientBookings.length > 0 ? (
                <div className="divide-y divide-border">
                  {clientBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={booking.service.images[0] || '/placeholder.svg'}
                          alt={booking.service.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              getStatusColor(booking.status)
                            )}>
                              {BOOKING_STATUS_LABELS[booking.status]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {CATEGORY_LABELS[booking.service.category]}
                            </span>
                          </div>
                          <h3 className="font-semibold">{booking.service.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Prestataire: {booking.helperName}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {booking.scheduledDate.toLocaleDateString('fr-FR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.scheduledTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.address.city}
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
                          {booking.status === 'accepted' && (
                            <Button variant="outline" size="sm" className="mt-2">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Contacter
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
