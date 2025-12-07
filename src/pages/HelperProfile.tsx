import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_LABELS, ServiceType } from '@/types';

// Données de démonstration pour le profil helper
const mockHelperProfile = {
  id: '1',
  firstName: 'Marc',
  lastName: 'Dubois',
  email: 'marc.dubois@email.com',
  phone: '06 98 76 54 32',
  avatar: null,
  address: {
    street: '42 Avenue des Champs',
    city: 'Lyon',
    postalCode: '69002',
    country: 'France',
  },
  createdAt: new Date('2022-03-10'),
  isVerified: true,
  kycStatus: 'approved' as const,
  description: 'Plombier professionnel avec plus de 15 ans d\'expérience. Spécialisé dans les dépannages urgents et les installations neuves. Travail soigné et garanti.',
  services: ['plomberie', 'chauffage'] as ServiceType[],
  hourlyRate: 45,
  rating: 4.9,
  reviewCount: 127,
  responseTime: 15,
  completedMissions: 189,
  balance: 2450,
  stats: {
    thisMonth: 12,
    thisWeek: 3,
    acceptanceRate: 94,
    onTimeRate: 98,
  },
};

// Avis des clients
const mockReviews = [
  {
    id: '1',
    clientName: 'Sophie M.',
    clientAvatar: null,
    rating: 5,
    comment: 'Intervention rapide et efficace pour une fuite sous mon évier. Marc est très professionnel et a tout expliqué clairement. Je recommande vivement !',
    date: new Date('2024-01-10'),
    missionTitle: 'Réparation fuite évier',
    serviceType: 'plomberie' as ServiceType,
  },
  {
    id: '2',
    clientName: 'Pierre L.',
    clientAvatar: null,
    rating: 5,
    comment: 'Excellent travail pour l\'installation de mon nouveau chauffe-eau. Ponctuel, propre et prix très correct.',
    date: new Date('2024-01-05'),
    missionTitle: 'Installation chauffe-eau',
    serviceType: 'chauffage' as ServiceType,
  },
  {
    id: '3',
    clientName: 'Marie D.',
    clientAvatar: null,
    rating: 4,
    comment: 'Bonne prestation dans l\'ensemble. Petit retard mais travail de qualité.',
    date: new Date('2023-12-28'),
    missionTitle: 'Débouchage canalisation',
    serviceType: 'plomberie' as ServiceType,
  },
  {
    id: '4',
    clientName: 'Thomas B.',
    clientAvatar: null,
    rating: 5,
    comment: 'Très satisfait ! Intervention urgente un dimanche soir, Marc a résolu le problème rapidement.',
    date: new Date('2023-12-20'),
    missionTitle: 'Urgence fuite toilettes',
    serviceType: 'plomberie' as ServiceType,
  },
  {
    id: '5',
    clientName: 'Claire R.',
    clientAvatar: null,
    rating: 5,
    comment: 'Professionnel, ponctuel et sympathique. Le travail est impeccable.',
    date: new Date('2023-12-15'),
    missionTitle: 'Réparation robinet',
    serviceType: 'plomberie' as ServiceType,
  },
];

const profileSections = [
  { id: 'overview', icon: User, label: 'Vue d\'ensemble' },
  { id: 'services', icon: Briefcase, label: 'Services & Tarifs' },
  { id: 'reviews', icon: Star, label: 'Avis clients' },
  { id: 'security', icon: Shield, label: 'Sécurité' },
  { id: 'wallet', icon: CreditCard, label: 'Portefeuille' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

const HelperProfile = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const profile = mockHelperProfile;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
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
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                  <Award className="w-3 h-3" />
                  Top Helper
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 mt-4">
                {renderStars(Math.round(profile.rating))}
                <span className="ml-1 font-semibold">{profile.rating}</span>
                <span className="text-sm text-muted-foreground">({profile.reviewCount} avis)</span>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Membre depuis {profile.createdAt.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Performances</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Missions complétées
                  </span>
                  <span className="font-semibold">{profile.completedMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Temps de réponse
                  </span>
                  <span className="font-semibold">{profile.responseTime} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Taux d'acceptation
                  </span>
                  <span className="font-semibold text-secondary">{profile.stats.acceptanceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Ponctualité
                  </span>
                  <span className="font-semibold text-secondary">{profile.stats.onTimeRate}%</span>
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
                  {section.id === 'reviews' && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {profile.reviewCount}
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
                {/* Description */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">À propos</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{profile.description}</p>
                </div>

                {/* Contact Info */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Informations de contact</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </div>
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
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl md:col-span-2">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">
                          {profile.address.street}, {profile.address.postalCode} {profile.address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* This Month Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold text-primary">{profile.stats.thisMonth}</p>
                    <p className="text-sm text-muted-foreground">Missions ce mois</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold text-secondary">{profile.stats.thisWeek}</p>
                    <p className="text-sm text-muted-foreground">Cette semaine</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold">{profile.hourlyRate}€</p>
                    <p className="text-sm text-muted-foreground">Tarif horaire</p>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-3xl font-bold text-warning">{profile.rating}</p>
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
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {profile.services.map((service) => (
                      <span
                        key={service}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium flex items-center gap-2"
                      >
                        <Wrench className="w-4 h-4" />
                        {SERVICE_LABELS[service]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Tarification</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Euro className="w-6 h-6 text-secondary" />
                      <div>
                        <p className="font-medium">Tarif horaire</p>
                        <p className="text-sm text-muted-foreground">Applicable à toutes les interventions</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{profile.hourlyRate}€/h</p>
                  </div>
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
                      <p className="text-4xl font-bold">{profile.rating}</p>
                      <div className="flex items-center justify-center mt-1">
                        {renderStars(Math.round(profile.rating))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{profile.reviewCount} avis</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = mockReviews.filter(r => r.rating === star).length;
                        const percentage = (count / mockReviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-4">{star}</span>
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-warning rounded-full"
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

                {/* Reviews List */}
                <div className="bg-card rounded-2xl border border-border">
                  <div className="p-5 border-b border-border">
                    <h3 className="text-lg font-semibold">Avis des clients</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-sm font-semibold">
                            {review.clientName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{review.clientName}</p>
                                <p className="text-sm text-muted-foreground">{review.missionTitle}</p>
                              </div>
                              <div className="text-right">
                                {renderStars(review.rating)}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {review.date.toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                              {SERVICE_LABELS[review.serviceType]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-6">Vérification d'identité (KYC)</h3>
                  
                  <div className={cn(
                    "p-4 rounded-xl flex items-center gap-4",
                    profile.kycStatus === 'approved' ? "bg-secondary/10" : "bg-warning/10"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      profile.kycStatus === 'approved' ? "bg-secondary text-secondary-foreground" : "bg-warning text-warning-foreground"
                    )}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {profile.kycStatus === 'approved' ? 'Identité vérifiée' : 'Vérification en cours'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.kycStatus === 'approved' 
                          ? 'Votre identité a été vérifiée avec succès'
                          : 'Nous vérifions actuellement vos documents'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-6">Sécurité du compte</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">Mot de passe</p>
                        <p className="text-sm text-muted-foreground">Dernière modification il y a 2 mois</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-secondary">Activée</p>
                      </div>
                      <Button variant="outline" size="sm">Gérer</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'wallet' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-primary-foreground">
                  <p className="text-sm opacity-80">Solde disponible</p>
                  <p className="text-4xl font-bold mt-2">{profile.balance.toFixed(2)}€</p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Retirer
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Historique
                    </Button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Coordonnées bancaires</h3>
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">IBAN •••• •••• •••• 4567</p>
                      <p className="text-sm text-muted-foreground">BNP Paribas</p>
                    </div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-6">Préférences de notifications</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Nouvelles missions disponibles', description: 'Recevez une alerte pour les nouvelles missions dans votre zone' },
                    { label: 'Messages clients', description: 'Notifications pour les messages de vos clients' },
                    { label: 'Rappels de rendez-vous', description: 'Rappel avant chaque intervention programmée' },
                    { label: 'Paiements reçus', description: 'Notification à chaque paiement validé' },
                    { label: 'Nouveaux avis', description: 'Soyez informé quand un client laisse un avis' },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{notif.label}</p>
                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 4} />
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
