import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
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
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Zap,
  Euro,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_LABELS, STATUS_LABELS, MissionStatus, ServiceType, URGENCY_LABELS, MissionUrgency } from '@/types';

// Missions disponibles (publiées par les clients)
const availableMissions = [
  {
    id: '1',
    title: 'Fuite importante sous évier',
    description: 'Fuite d\'eau sous l\'évier de ma cuisine depuis ce matin. L\'eau s\'accumule et j\'ai dû couper l\'arrivée d\'eau.',
    serviceType: 'plomberie' as ServiceType,
    urgency: 'urgent' as MissionUrgency,
    address: 'Paris 15ème (2.3 km)',
    estimatedBudget: 80,
    preferredDate: new Date('2024-01-16'),
    createdAt: new Date('2024-01-15T10:30:00'),
    clientName: 'Jean D.',
    clientRating: 4.7,
    photos: 2,
  },
  {
    id: '2',
    title: 'Installation nouveau radiateur',
    description: 'Besoin d\'installer un radiateur électrique dans une chambre de 15m². Le radiateur est déjà acheté.',
    serviceType: 'chauffage' as ServiceType,
    urgency: 'normal' as MissionUrgency,
    address: 'Paris 14ème (3.8 km)',
    estimatedBudget: 120,
    preferredDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15T09:00:00'),
    clientName: 'Marie L.',
    clientRating: 4.9,
    photos: 3,
  },
  {
    id: '3',
    title: 'Réparation chasse d\'eau',
    description: 'La chasse d\'eau de mes toilettes ne fonctionne plus correctement, elle coule en permanence.',
    serviceType: 'plomberie' as ServiceType,
    urgency: 'normal' as MissionUrgency,
    address: 'Paris 16ème (4.1 km)',
    estimatedBudget: 60,
    preferredDate: new Date('2024-01-18'),
    createdAt: new Date('2024-01-14T16:45:00'),
    clientName: 'Pierre B.',
    clientRating: 5.0,
    photos: 1,
  },
  {
    id: '4',
    title: 'Urgence chauffe-eau en panne',
    description: 'Mon chauffe-eau ne produit plus d\'eau chaude depuis hier soir. C\'est un cumulus de 200L.',
    serviceType: 'chauffage' as ServiceType,
    urgency: 'emergency' as MissionUrgency,
    address: 'Paris 13ème (1.5 km)',
    estimatedBudget: 150,
    preferredDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15T08:00:00'),
    clientName: 'Sophie M.',
    clientRating: 4.8,
    photos: 2,
  },
];

// Mes missions en cours
const myMissions = [
  {
    id: '5',
    title: 'Débouchage canalisation salle de bain',
    serviceType: 'plomberie' as ServiceType,
    status: 'in_progress' as MissionStatus,
    address: 'Paris 11ème',
    clientName: 'Thomas R.',
    scheduledDate: new Date('2024-01-15T14:00:00'),
    estimatedPrice: 90,
  },
  {
    id: '6',
    title: 'Entretien chaudière annuel',
    serviceType: 'chauffage' as ServiceType,
    status: 'accepted' as MissionStatus,
    address: 'Paris 12ème',
    clientName: 'Claire V.',
    scheduledDate: new Date('2024-01-17T10:00:00'),
    estimatedPrice: 120,
  },
];

const HelperDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<MissionUrgency | 'all'>('all');

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'available', icon: Search, label: 'Missions disponibles', badge: availableMissions.length },
    { id: 'my-missions', icon: FileText, label: 'Mes missions', badge: myMissions.length },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 2 },
    { id: 'wallet', icon: Wallet, label: 'Portefeuille' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const stats = [
    { label: 'Missions ce mois', value: '8', icon: FileText, color: 'text-primary' },
    { label: 'Revenus du mois', value: '1,240€', icon: Euro, color: 'text-secondary' },
    { label: 'Note moyenne', value: '4.9', icon: Star, color: 'text-warning' },
    { label: 'Taux de réponse', value: '95%', icon: TrendingUp, color: 'text-info' },
  ];

  const getUrgencyColor = (urgency: MissionUrgency) => {
    switch (urgency) {
      case 'emergency': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'urgent': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'accepted': return 'bg-info/10 text-info';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredMissions = availableMissions.filter((mission) => {
    if (serviceFilter !== 'all' && mission.serviceType !== serviceFilter) return false;
    if (urgencyFilter !== 'all' && mission.urgency !== urgencyFilter) return false;
    return true;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) return `il y a ${diffHours}h`;
    return `il y a ${diffMins}min`;
  };

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
                  {item.badge && (
                    <span className={cn(
                      "w-5 h-5 rounded-full text-xs flex items-center justify-center",
                      item.id === 'available' ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"
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
          <Link to="/helper/profile" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
              MD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Marc Dubois</p>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                4.9 • Helper Pro
              </p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">Dashboard Helper</h1>
            <p className="text-sm text-muted-foreground">Bienvenue, Marc !</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
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

          {/* Available Missions Section */}
          {(activeTab === 'home' || activeTab === 'available') && (
            <div className="bg-card rounded-2xl border border-border mb-8">
              <div className="p-5 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Missions disponibles</h2>
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                      {filteredMissions.length} nouvelles
                    </span>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value as ServiceType | 'all')}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="all">Tous les services</option>
                      {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <select
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value as MissionUrgency | 'all')}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="all">Toutes urgences</option>
                      {Object.entries(URGENCY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {filteredMissions.map((mission) => (
                  <div 
                    key={mission.id}
                    className="p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Mission Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{mission.title}</h3>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium border",
                                getUrgencyColor(mission.urgency)
                              )}>
                                {mission.urgency === 'emergency' && <Zap className="w-3 h-3 inline mr-1" />}
                                {URGENCY_LABELS[mission.urgency]}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mission.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground ml-13">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {mission.address}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {mission.preferredDate.toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimeAgo(mission.createdAt)}
                          </span>
                          {mission.photos > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {mission.photos} photo{mission.photos > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Client & Price */}
                      <div className="flex items-center lg:flex-col lg:items-end gap-4 lg:gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{mission.clientName}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            {mission.clientRating}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary">{mission.estimatedBudget}€</p>
                          <p className="text-xs text-muted-foreground">Budget estimé</p>
                        </div>
                        <Button variant="hero" size="sm">
                          Voir & Postuler
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Missions Section */}
          {(activeTab === 'home' || activeTab === 'my-missions') && (
            <div className="bg-card rounded-2xl border border-border">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Mes missions en cours</h2>
                </div>
                <Link to="/helper/missions" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Voir tout
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="divide-y divide-border">
                {myMissions.map((mission) => (
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
                          <User className="w-4 h-4" />
                          {mission.clientName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {mission.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {mission.scheduledDate.toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right hidden md:block">
                      <p className="font-bold text-lg">{mission.estimatedPrice}€</p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
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
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HelperDashboard;
