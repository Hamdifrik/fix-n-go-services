import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Camera,
  Shield,
  CreditCard,
  Bell,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  Clock,
  Euro,
  Award,
  TrendingUp,
  MessageSquare,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_LABELS, ServiceType } from '@/types';

// Interfaces
interface HelperProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  avatar: string | null;
  expertise: string[];
  hourlyRate: number;
  availability: boolean;
  rating: number;
  totalReviews: number;
  bookingHistory: any[];
  isVerified: boolean;
  isActive: boolean;
  certifications: any[];
  createdAt: string;
  updatedAt: string;
  bio?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

interface Review {
  _id: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  booking: {
    _id: string;
    service: {
      title: string;
      category: string;
    };
  };
  rating: number;
  comment: string;
  response?: string;
  responseDate?: string;
  createdAt: string;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const profileSections = [
  { id: 'overview', icon: User, label: 'Vue d\'ensemble' },
  { id: 'services', icon: Briefcase, label: 'Services & Tarifs' },
  { id: 'reviews', icon: Star, label: 'Avis clients' },
  { id: 'security', icon: Shield, label: 'Sécurité' },
  { id: 'wallet', icon: CreditCard, label: 'Portefeuille' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

const HelperProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [profile, setProfile] = useState<HelperProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference[]>([
    { id: 'new_missions', label: 'Nouvelles missions disponibles', description: 'Recevez une alerte pour les nouvelles missions dans votre zone', enabled: true },
    { id: 'messages', label: 'Messages clients', description: 'Notifications pour les messages de vos clients', enabled: true },
    { id: 'reminders', label: 'Rappels de rendez-vous', description: 'Rappel avant chaque intervention programmée', enabled: true },
    { id: 'payments', label: 'Paiements reçus', description: 'Notification à chaque paiement validé', enabled: true },
    { id: 'new_reviews', label: 'Nouveaux avis', description: 'Soyez informé quand un client laisse un avis', enabled: true },
  ]);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    services: true,
    reviews: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer toutes les données
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllData = async () => {
      try {
        setIsLoading({ profile: true, services: true, reviews: true });
        
        const [profileRes, servicesRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_URL}/services/helper/my-services`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/reviews/helper/${JSON.parse(localStorage.getItem('user') || '{}')._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        // Traiter le profil
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.data.role === 'helper') {
            setProfile(profileData.data);
          } else {
            navigate('/dashboard');
          }
        }

        // Traiter les services
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          if (servicesData.success) {
            setServices(servicesData.data);
          }
        }

        // Traiter les avis
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          if (reviewsData.success) {
            setReviews(reviewsData.data);
          }
        }

      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading({ profile: false, services: false, reviews: false });
      }
    };

    fetchAllData();
  }, [navigate, API_URL]);

  // Fonction pour mettre à jour le profil
  const updateProfile = async (updates: Partial<HelperProfile>) => {
    const token = localStorage.getItem('token');
    if (!token || !profile) return;

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
          setIsEditing(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Fonction pour mettre à jour un service
  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Mettre à jour localement
          setServices(prev => prev.map(service => 
            service._id === serviceId ? { ...service, ...updates } : service
          ));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Fonction pour supprimer un service
  const deleteService = async (serviceId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Supprimer localement
          setServices(prev => prev.filter(service => service._id !== serviceId));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Fonction pour répondre à un avis
  const respondToReview = async (reviewId: string, response: string) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Mettre à jour localement
          setReviews(prev => prev.map(review => 
            review._id === reviewId ? { 
              ...review, 
              response: data.data.response,
              responseDate: data.data.responseDate 
            } : review
          ));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!profile) return '??';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-warning fill-warning" : "text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculer les missions complétées ce mois
  const getCompletedMissionsThisMonth = () => {
    if (!profile?.bookingHistory) return 0;
    const now = new Date();
    return profile.bookingHistory.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear();
    }).length;
  };

  // Calculer le revenu moyen
  const getAverageRevenue = () => {
    if (!services.length) return 0;
    const total = services.reduce((sum, service) => sum + service.price, 0);
    return Math.round(total / services.length);
  };

  // Afficher un loader pendant le chargement
  if (isLoading.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le profil n'a pas pu être chargé
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error || 'Impossible de charger le profil'}</p>
          <Button onClick={() => navigate('/helper/dashboard')}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/helper/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Mon Profil Helper</h1>
            <p className="text-sm text-muted-foreground">Gérez votre profil professionnel</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Profil Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Card */}
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {getUserInitials()}
                </div>
                <button 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  onClick={() => {/* TODO: Upload avatar */}}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-lg font-semibold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-sm text-muted-foreground">Helper Professionnel</p>
              
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Vérifié
                  </span>
                )}
                {profile.isActive && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Actif
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-1 mt-4">
                {renderStars(Math.round(profile.rating))}
                <span className="ml-1 font-semibold">{profile.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({profile.totalReviews} avis)</span>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Membre depuis {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Performances</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Services publiés
                  </span>
                  <span className="font-semibold">{services.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Avis reçus
                  </span>
                  <span className="font-semibold">{reviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Revenu moyen
                  </span>
                  <span className="font-semibold text-secondary">{getAverageRevenue()}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Disponibilité
                  </span>
                  <span className={cn(
                    "font-semibold",
                    profile.availability ? "text-success" : "text-destructive"
                  )}>
                    {profile.availability ? 'Disponible' : 'Occupé'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <nav className="bg-card rounded-2xl border border-border overflow-hidden">
              {profileSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-0",
                    activeSection === section.id
                      ? "bg-primary/5 text-primary"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="flex-1">{section.label}</span>
                  {section.id === 'reviews' && reviews.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {reviews.length}
                    </span>
                  )}
                  {section.id === 'services' && services.length > 0 && (
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      {services.length}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Informations de contact</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="w-4 h-4" />
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Prénom</label>
                          <input 
                            type="text" 
                            defaultValue={profile.firstName}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Nom</label>
                          <input 
                            type="text" 
                            defaultValue={profile.lastName}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Téléphone</label>
                        <input 
                          type="tel" 
                          defaultValue={profile.phone}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => {
                          // TODO: Implémenter la sauvegarde
                          setIsEditing(false);
                        }}>
                          Sauvegarder
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p className="font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold text-primary">{services.length}</p>
                    <p className="text-sm text-muted-foreground">Services actifs</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold">{getAverageRevenue()}€</p>
                    <p className="text-sm text-muted-foreground">Revenu moyen</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold text-warning">{profile.rating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'services' && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Mes services</h3>
                    <div className="flex gap-2">
                      <Link to="/helper/services/new">
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Nouveau service
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {isLoading.services ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div key={service._id} className="border border-border rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{service.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/helper/services/${service._id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (window.confirm('Supprimer ce service ?')) {
                                    deleteService(service._id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {SERVICE_LABELS[service.category as ServiceType] || service.category}
                            </span>
                            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                              {service.price}€
                            </span>
                            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                              {service.duration} min
                            </span>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-sm",
                              service.isActive 
                                ? "bg-success/10 text-success" 
                                : "bg-destructive/10 text-destructive"
                            )}>
                              {service.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Aucun service configuré</p>
                      <Link to="/helper/services/new">
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Créer mon premier service
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'reviews' && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Résumé des avis</h3>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{profile.rating.toFixed(1)}</p>
                      <div className="flex items-center justify-center mt-1">
                        {renderStars(Math.round(profile.rating))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{reviews.length} avis</p>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-8">{rating} ★</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-warning"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {isLoading.reviews ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="bg-card rounded-2xl border border-border">
                    <div className="p-5 border-b border-border">
                      <h3 className="text-lg font-semibold">Avis des clients</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {reviews.map((review) => (
                        <div key={review._id} className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Avatar du CLIENT */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-sm font-semibold">
                              {review.client.firstName?.[0] || 'C'}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  {/* Nom du CLIENT */}
                                  <p className="font-medium">
                                    {review.client.firstName} {review.client.lastName}
                                  </p>
                                  
                                  {/* Service concerné */}
                                  <p className="text-sm text-muted-foreground">
                                    {review.booking?.service?.title || 'Service'} • 
                                    {SERVICE_LABELS[review.booking?.service?.category as ServiceType] || 
                                    review.booking?.service?.category}
                                  </p>
                                </div>
                                
                                <div className="text-right">
                                  {renderStars(review.rating)}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(review.createdAt)}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Commentaire du CLIENT */}
                              <p className="text-muted-foreground mb-4">{review.comment}</p>
                              
                              {/* Réponse du HELPER */}
                              {review.response ? (
                                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                      <User className="w-3 h-3 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Votre réponse</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{review.response}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(review.responseDate!)}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2">Répondre à ce client :</p>
                                  <textarea 
                                    placeholder={`Répondre à ${review.client.firstName}...`}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                    rows={3}
                                    onBlur={(e) => {
                                      if (e.target.value.trim()) {
                                        respondToReview(review._id, e.target.value);
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Votre réponse sera visible par tous les utilisateurs
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Aucun avis pour le moment</p>
                    <p className="text-sm text-muted-foreground">
                      Les avis de vos clients apparaîtront ici
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-6">Vérification d'identité (KYC)</h3>
                  
                  <div className={cn(
                    "p-4 rounded-xl flex items-center gap-4",
                    profile.isVerified ? "bg-secondary/10" : "bg-warning/10"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      profile.isVerified ? "bg-secondary text-secondary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {profile.isVerified ? 'Identité vérifiée' : 'Vérification en attente'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.isVerified 
                          ? 'Votre identité a été vérifiée avec succès'
                          : 'Complétez votre vérification pour débloquer toutes les fonctionnalités'}
                      </p>
                    </div>
                    {!profile.isVerified && (
                      <Button variant="outline" size="sm">
                        Compléter
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-6">Sécurité du compte</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">Mot de passe</p>
                        <p className="text-sm text-muted-foreground">Modifier votre mot de passe</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-muted-foreground">Sécurisez votre compte</p>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-6">Préférences de notifications</h3>
                
                <div className="space-y-4">
                  {notificationPrefs.map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{pref.label}</p>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={pref.enabled}
                          onChange={(e) => {
                            setNotificationPrefs(prev => 
                              prev.map(p => p.id === pref.id 
                                ? { ...p, enabled: e.target.checked } 
                                : p
                              )
                            );
                            // TODO: Sauvegarder sur le serveur
                          }}
                        />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperProfile;