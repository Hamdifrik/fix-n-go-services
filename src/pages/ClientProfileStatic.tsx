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
  FileText,
  Star,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Données de démonstration pour le profil client
const mockClientProfile = {
  id: '1',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '06 12 34 56 78',
  avatar: null,
  address: {
    street: '15 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    country: 'France',
  },
  createdAt: new Date('2023-06-15'),
  isVerified: true,
  kycStatus: 'approved' as const,
  stats: {
    totalMissions: 12,
    completedMissions: 10,
    totalSpent: 1850,
    averageRating: 4.8,
  },
};

const profileSections = [
  { id: 'personal', icon: User, label: 'Informations personnelles' },
  { id: 'address', icon: MapPin, label: 'Adresse' },
  { id: 'security', icon: Shield, label: 'Sécurité & Vérification' },
  { id: 'payment', icon: CreditCard, label: 'Moyens de paiement' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

const ClientProfile = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const profile = mockClientProfile;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Mon Profil</h1>
            <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
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
              <p className="text-sm text-muted-foreground">Client</p>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Vérifié
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Membre depuis {profile.createdAt.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Missions totales</span>
                  <span className="font-semibold">{profile.stats.totalMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Missions terminées</span>
                  <span className="font-semibold text-secondary">{profile.stats.completedMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total dépensé</span>
                  <span className="font-semibold">{profile.stats.totalSpent}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Note moyenne donnée</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-semibold">{profile.stats.averageRating}</span>
                  </div>
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
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'personal' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Prénom</label>
                    <p className="font-medium">{profile.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Nom</label>
                    <p className="font-medium">{profile.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </label>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'address' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Adresse</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Rue</label>
                    <p className="font-medium">{profile.address.street}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Code postal</label>
                      <p className="font-medium">{profile.address.postalCode}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Ville</label>
                      <p className="font-medium">{profile.address.city}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Pays</label>
                      <p className="font-medium">{profile.address.country}</p>
                    </div>
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
                        <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-muted-foreground">Non activée</p>
                      </div>
                      <Button variant="outline" size="sm">Activer</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'payment' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Moyens de paiement</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Ajouter une carte
                  </Button>
                </div>
                
                <div className="p-4 border border-border rounded-xl flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-primary to-info rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expire 12/25</p>
                  </div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">Par défaut</span>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-6">Préférences de notifications</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Nouvelles missions acceptées', description: 'Recevez une notification quand un Helper accepte votre mission' },
                    { label: 'Messages', description: 'Notifications pour les nouveaux messages' },
                    { label: 'Rappels de rendez-vous', description: 'Rappel avant chaque intervention programmée' },
                    { label: 'Promotions et actualités', description: 'Restez informé des offres spéciales' },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{notif.label}</p>
                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
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

export default ClientProfile;
