import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Plus, 
  Bell, 
  MessageSquare, 
  User, 
  LogOut,
  Home,
  FileText,
  Wallet,
  Settings,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_LABELS, STATUS_LABELS, MissionStatus, ServiceType } from '@/types';

// Interface pour l'utilisateur
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'helper';
}

// Données de démonstration
const mockMissions = [
  {
    id: '1',
    title: 'Fuite sous évier cuisine',
    serviceType: 'plomberie' as ServiceType,
    status: 'in_progress' as MissionStatus,
    address: 'Paris 15ème',
    createdAt: new Date('2024-01-15'),
    helperName: 'Marc Dubois',
    helperRating: 4.8,
  },
  {
    id: '2',
    title: 'Installation prise électrique',
    serviceType: 'electricite' as ServiceType,
    status: 'pending' as MissionStatus,
    address: 'Paris 11ème',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Remplacement serrure porte entrée',
    serviceType: 'serrurerie' as ServiceType,
    status: 'completed' as MissionStatus,
    address: 'Paris 20ème',
    createdAt: new Date('2024-01-10'),
    helperName: 'Sophie Martin',
    helperRating: 5.0,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('missions');
  const [user, setUser] = useState<User | null>(null);

  // Récupérer les informations de l'utilisateur au chargement
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        // Si erreur, rediriger vers login
        navigate('/login');
      }
    } else {
      // Si pas d'utilisateur, rediriger vers login
      navigate('/login');
    }
  }, [navigate]);

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token et les données utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return '??';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Accueil', path: null },
    { id: 'missions', icon: FileText, label: 'Mes missions', path: null },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 3, path: null },
    { id: 'profile', icon: User, label: 'Profil', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Paramètres', path: null },
  ];

  const stats = [
    { label: 'Missions actives', value: '2', icon: FileText, color: 'text-primary' },
    { label: 'Messages non lus', value: '3', icon: MessageSquare, color: 'text-secondary' },
    { label: 'Note moyenne', value: '4.9', icon: Star, color: 'text-warning' },
    { label: 'Économies réalisées', value: '320€', icon: TrendingUp, color: 'text-success' },
  ];

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'accepted': return 'bg-info/10 text-info';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-success/10 text-success';
      case 'validated': return 'bg-secondary/10 text-secondary';
      case 'disputed': return 'bg-destructive/10 text-destructive';
      case 'cancelled': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Afficher un loader si l'utilisateur n'est pas encore chargé
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
                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
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
            <h1 className="text-xl font-semibold">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Bienvenue, {user.firstName} !</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <Link to="/mission/new">
              <Button variant="hero" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle mission
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

          {/* Missions List */}
          <div className="bg-card rounded-2xl border border-border">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mes missions récentes</h2>
              <Link to="/missions" className="text-sm text-primary hover:underline flex items-center gap-1">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="divide-y divide-border">
              {mockMissions.map((mission) => (
                <Link 
                  key={mission.id}
                  to={`/mission/${mission.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors"
                >
                  {/* Service Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Wrench className="w-6 h-6" />
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{mission.title}</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getStatusColor(mission.status)
                      )}>
                        {STATUS_LABELS[mission.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {mission.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {mission.createdAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Helper Info (if assigned) */}
                  {mission.helperName && (
                    <div className="hidden md:flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{mission.helperName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          {mission.helperRating}
                        </div>
                      </div>
                    </div>
                  )}

                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
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
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground"
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

export default Dashboard;