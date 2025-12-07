import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Wrench, 
  MapPin, 
  Calendar,
  Clock,
  Star,
  Euro,
  MessageSquare,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle,
  Zap,
  User,
  ChevronRight,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_LABELS, STATUS_LABELS, MissionStatus, ServiceType, URGENCY_LABELS, MissionUrgency } from '@/types';

// Données de démonstration
const mockMission = {
  id: '1',
  title: 'Fuite importante sous évier cuisine',
  description: 'Fuite d\'eau sous l\'évier de ma cuisine depuis ce matin. L\'eau s\'accumule rapidement et j\'ai dû couper l\'arrivée d\'eau principale. Le problème semble venir du siphon ou de la jonction avec le tuyau d\'évacuation. C\'est assez urgent car je n\'ai plus d\'eau dans la cuisine.',
  serviceType: 'plomberie' as ServiceType,
  urgency: 'urgent' as MissionUrgency,
  status: 'in_progress' as MissionStatus,
  address: {
    street: '15 Rue de la Pompe',
    city: 'Paris',
    postalCode: '75016',
    country: 'France',
  },
  photos: ['/placeholder.svg', '/placeholder.svg'],
  estimatedBudget: 80,
  preferredDate: new Date('2024-01-16'),
  preferredTimeSlot: { start: '14:00', end: '18:00' },
  createdAt: new Date('2024-01-15T10:30:00'),
  client: {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    rating: 4.7,
    phone: '06 12 34 56 78',
  },
  helper: {
    id: '2',
    firstName: 'Marc',
    lastName: 'Dubois',
    rating: 4.9,
    reviewCount: 127,
    phone: '06 98 76 54 32',
    services: ['plomberie', 'chauffage'] as ServiceType[],
  },
};

const MissionDetail = () => {
  const { id } = useParams();
  const [isHelper, setIsHelper] = useState(false); // Toggle pour demo
  const mission = mockMission;

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/30';
      case 'accepted': return 'bg-info/10 text-info border-info/30';
      case 'in_progress': return 'bg-primary/10 text-primary border-primary/30';
      case 'completed': return 'bg-success/10 text-success border-success/30';
      case 'validated': return 'bg-secondary/10 text-secondary border-secondary/30';
      case 'disputed': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUrgencyColor = (urgency: MissionUrgency) => {
    switch (urgency) {
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'urgent': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={isHelper ? "/helper/dashboard" : "/dashboard"} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Détail de la mission</h1>
            <p className="text-sm text-muted-foreground">Mission #{id}</p>
          </div>
          {/* Toggle pour demo */}
          <button
            onClick={() => setIsHelper(!isHelper)}
            className="px-3 py-1 rounded-lg bg-muted text-sm"
          >
            Vue: {isHelper ? 'Helper' : 'Client'}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Header */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Wrench className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h2 className="text-xl font-bold">{mission.title}</h2>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium border",
                      getStatusColor(mission.status)
                    )}>
                      {STATUS_LABELS[mission.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2 py-1 rounded-lg bg-muted text-sm">
                      {SERVICE_LABELS[mission.serviceType]}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-sm flex items-center gap-1",
                      getUrgencyColor(mission.urgency)
                    )}>
                      {mission.urgency === 'emergency' && <Zap className="w-3 h-3" />}
                      {URGENCY_LABELS[mission.urgency]}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{mission.description}</p>

              {/* Photos */}
              {mission.photos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Photos du problème
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mission.photos.map((photo, index) => (
                      <div key={index} className="aspect-video rounded-xl bg-muted overflow-hidden">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Informations détaillées</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{mission.address.street}</p>
                    <p className="text-sm">{mission.address.postalCode} {mission.address.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date souhaitée</p>
                    <p className="font-medium">{mission.preferredDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p className="text-sm">{mission.preferredTimeSlot.start} - {mission.preferredTimeSlot.end}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Euro className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget estimé</p>
                    <p className="font-medium text-lg">{mission.estimatedBudget}€</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Créée le</p>
                    <p className="font-medium">{mission.createdAt.toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm">{mission.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions based on status */}
            {mission.status === 'in_progress' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                {isHelper ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Terminez la mission en uploadant les photos du travail effectué.</p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Ajouter des photos
                      </Button>
                      <Button variant="hero" className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Marquer comme terminée
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">L'intervention est en cours. Vous serez notifié quand le Helper aura terminé.</p>
                    <Button variant="outline" className="gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Signaler un problème
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">
                {isHelper ? 'Client' : 'Helper assigné'}
              </h3>
              
              {isHelper ? (
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-lg font-semibold">
                    {mission.client.firstName[0]}{mission.client.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{mission.client.firstName} {mission.client.lastName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {mission.client.rating}
                    </div>
                  </div>
                </div>
              ) : mission.helper ? (
                <Link to={`/helper/${mission.helper.id}/profile`} className="block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-semibold text-white">
                      {mission.helper.firstName[0]}{mission.helper.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{mission.helper.firstName} {mission.helper.lastName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        {mission.helper.rating} ({mission.helper.reviewCount} avis)
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                  </div>
                </Link>
              ) : (
                <p className="text-muted-foreground">Aucun Helper assigné pour le moment.</p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Appeler
                </Button>
                <Button variant="hero" className="flex-1 gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Paiement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Budget estimé</span>
                  <span className="font-semibold">{mission.estimatedBudget}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                    En séquestre
                  </span>
                </div>
                <hr className="border-border" />
                <p className="text-xs text-muted-foreground">
                  Le paiement sera libéré une fois la mission validée par les deux parties.
                </p>
              </div>
            </div>

            {/* Quick Chat */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Messages</h3>
              </div>
              <div className="h-48 p-4 bg-muted/20 flex items-center justify-center">
                <p className="text-muted-foreground text-sm text-center">
                  Démarrez une conversation<br />avec {isHelper ? 'le client' : 'le Helper'}
                </p>
              </div>
              <div className="p-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Votre message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-sm"
                />
                <Button size="icon" variant="hero">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
