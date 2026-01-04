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
  Wallet,
  Settings,
  Plus,
  Star,
  TrendingUp,
  Euro,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockServices } from '@/data/mockServices';
import { Service, Booking, CATEGORY_LABELS, BOOKING_STATUS_LABELS } from '@/types/service';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'helper';
}

// Réservations de démonstration
const mockBookings: (Booking & { clientName: string })[] = [
  {
    id: 'b1',
    serviceId: '1',
    service: mockServices[0],
    clientId: 'c1',
    helperId: 'h1',
    status: 'pending',
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
    clientName: 'Marie Dupont',
  },
  {
    id: 'b2',
    serviceId: '1',
    service: mockServices[0],
    clientId: 'c2',
    helperId: 'h1',
    status: 'accepted',
    scheduledDate: new Date('2024-01-18'),
    scheduledTime: '10:00',
    address: {
      street: '45 avenue Victor Hugo',
      city: 'Paris',
      postalCode: '75016',
    },
    totalPrice: 50,
    paymentStatus: 'held',
    createdAt: new Date('2024-01-14'),
    clientName: 'Pierre Martin',
  },
  {
    id: 'b3',
    serviceId: '7',
    service: mockServices[6],
    clientId: 'c3',
    helperId: 'h1',
    status: 'completed',
    scheduledDate: new Date('2024-01-10'),
    scheduledTime: '09:00',
    address: {
      street: '8 rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
    },
    totalPrice: 150,
    paymentStatus: 'released',
    createdAt: new Date('2024-01-08'),
    completedAt: new Date('2024-01-10'),
    clientName: 'Sophie Bernard',
  },
];

const NewHelperDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [user, setUser] = useState<UserData | null>(null);

  // Récupérer les informations de l'utilisateur au chargement
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.role !== 'helper') {
          navigate('/dashboard');
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

  // Filtrer les services du helper (simulation)
  const myServices = mockServices.filter(s => s.helperId === 'h1');
  const pendingBookings = mockBookings.filter(b => b.status === 'pending');
  const acceptedBookings = mockBookings.filter(b => b.status === 'accepted');

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'services', icon: Package, label: 'Mes services', badge: myServices.length },
    { id: 'bookings', icon: CalendarIcon, label: 'Réservations', badge: pendingBookings.length },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 2 },
    { id: 'wallet', icon: Wallet, label: 'Portefeuille' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const stats = [
    { label: 'Services actifs', value: myServices.length.toString(), icon: Package, color: 'text-primary' },
    { label: 'Revenus du mois', value: '1,240€', icon: Euro, color: 'text-secondary' },
    { label: 'Note moyenne', value: '4.9', icon: Star, color: 'text-warning' },
    { label: 'Vues ce mois', value: '234', icon: Eye, color: 'text-info' },
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
            <span className="text-xl font-bold gradient-text">FixIt Pro</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
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
                    <span className={cn(
                      "w-5 h-5 rounded-full text-xs flex items-center justify-center",
                      item.id === 'bookings' ? "bg-warning text-warning-foreground" : "bg-primary text-primary-foreground"
                    )}>
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
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                4.9 • Helper Pro
              </p>
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
            <h1 className="text-xl font-semibold">Dashboard Helper</h1>
            <p className="text-sm text-muted-foreground">Bienvenue, {user.firstName} !</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <Link to="/helper/services/new">
              <Button variant="hero" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau service
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-5 border border-border hover-lift"
              >
                <div className={cn("w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Services Section */}
          {(activeTab === 'home' || activeTab === 'services') && (
            <div className="bg-card rounded-2xl border border-border mb-8">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Mes services</h2>
                </div>
                <Link to="/helper/services/new" className="text-sm text-primary hover:underline">
                  + Ajouter un service
                </Link>
              </div>
              
              {myServices.length > 0 ? (
                <div className="divide-y divide-border">
                  {myServices.map((service) => (
                    <div 
                      key={service.id}
                      className="p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={service.images[0] || '/placeholder.svg'}
                          alt={service.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {CATEGORY_LABELS[service.category]}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                              {service.price}€{service.pricingType === 'hourly' ? '/h' : ''}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warning fill-warning" />
                              {service.rating} ({service.reviewCount})
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              45 vues
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Modifier</Button>
                          <button className="p-2 rounded-lg hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Aucun service publié</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre premier service pour commencer à recevoir des réservations
                  </p>
                  <Link to="/helper/services/new">
                    <Button variant="hero">Créer un service</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Bookings Section */}
          {(activeTab === 'home' || activeTab === 'bookings') && (
            <div className="bg-card rounded-2xl border border-border">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Demandes de réservation</h2>
                  {pendingBookings.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-sm font-medium">
                      {pendingBookings.length} en attente
                    </span>
                  )}
                </div>
              </div>
              
              {mockBookings.length > 0 ? (
                <div className="divide-y divide-border">
                  {mockBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              getStatusColor(booking.status)
                            )}>
                              {BOOKING_STATUS_LABELS[booking.status]}
                            </span>
                          </div>
                          <h3 className="font-semibold">{booking.service.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {booking.clientName}
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
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary">{booking.totalPrice}€</p>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <Button variant="hero" size="sm" className="gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Accepter
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
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
                  <p className="text-muted-foreground">
                    Les demandes de réservation apparaîtront ici
                  </p>
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
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative",
              activeTab === item.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NewHelperDashboard;
