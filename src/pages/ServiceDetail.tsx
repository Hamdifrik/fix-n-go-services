import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  BadgeCheck, 
  MessageSquare, 
  ChevronLeft,
  Calendar,
  Shield,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useService } from '@/hooks/useServices';
import { useHelperReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  carpentry: 'Menuiserie',
  painting: 'Peinture',
  cleaning: 'Ménage',
  gardening: 'Jardinage',
  moving: 'Déménagement',
  'appliance-repair': 'Réparation',
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

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: serviceResponse, isLoading, error } = useService(id || '');
  const service = serviceResponse?.data;

  const helperId = typeof service?.helper === 'string' 
    ? service.helper 
    : service?.helper?._id;

  const { data: reviewsResponse } = useHelperReviews(helperId || '', { limit: 10 });
  const reviews = reviewsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="aspect-video rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button>Retour au catalogue</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const helper = typeof service.helper === 'string' ? null : service.helper;
  const images = service.images?.length > 0 ? service.images : ['/placeholder.svg'];

  const formatPrice = () => {
    return `${service.price}€`;
  };

  const formatDuration = () => {
    if (service.duration < 60) {
      return `${service.duration} minutes`;
    }
    const hours = Math.floor(service.duration / 60);
    const mins = service.duration % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours} heures`;
  };

  const handleBook = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${service._id}`);
  };

  const handleContact = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('Contact helper:', helperId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour aux services
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={images[selectedImage] || '/placeholder.svg'}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                          selectedImage === index ? "border-primary" : "border-transparent"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {CATEGORY_LABELS[service.category] || service.category}
                  </span>
                  {helper && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {helper.rating?.toFixed(1) || '4.5'} ({helper.totalReviews || 0} avis)
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h1>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {service.description}
                </p>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Helper Profile */}
              {helper && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">À propos du prestataire</h2>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xl">
                      {helper.firstName?.charAt(0)}{helper.lastName?.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {helper.firstName} {helper.lastName}
                        </h3>
                        {helper.isVerified && (
                          <BadgeCheck className="w-5 h-5 text-secondary" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="w-4 h-4" />
                        {helper.address?.city || 'France'}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-xl">
                          <p className="text-xl font-bold text-primary">
                            {helper.rating?.toFixed(1) || '4.5'}
                          </p>
                          <p className="text-xs text-muted-foreground">Note moyenne</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-xl">
                          <p className="text-xl font-bold">{helper.totalReviews || 0}</p>
                          <p className="text-xs text-muted-foreground">Avis</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-xl">
                          <p className="text-xl font-bold">30min</p>
                          <p className="text-xs text-muted-foreground">Temps de réponse</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-xl">
                          <p className="text-xl font-bold">Pro</p>
                          <p className="text-xs text-muted-foreground">Statut</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Avis clients ({reviews.length})
                </h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review._id} className="bg-card rounded-xl border border-border p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                              {typeof review.client === 'string' 
                                ? 'C' 
                                : review.client?.firstName?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <p className="font-medium">
                                {typeof review.client === 'string' 
                                  ? 'Client' 
                                  : `${review.client?.firstName || 'Client'} ${review.client?.lastName?.charAt(0) || ''}.`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-4 h-4",
                                  i < review.rating ? "text-warning fill-warning" : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{review.comment}</p>
                        
                        {review.response && (
                          <div className="mt-4 pl-4 border-l-2 border-primary">
                            <p className="text-sm font-medium mb-1">Réponse du prestataire</p>
                            <p className="text-sm text-muted-foreground">{review.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-xl">
                    <p className="text-muted-foreground">Pas encore d'avis pour ce service</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-secondary">{formatPrice()}</p>
                    <p className="text-muted-foreground">Prix forfaitaire</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Durée estimée
                      </span>
                      <span className="font-medium">{formatDuration()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Disponibilité
                      </span>
                      <span className="font-medium text-secondary">Dès demain</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        Paiement sécurisé
                      </span>
                      <span className="font-medium">Garanti</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      onClick={handleBook}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Réserver maintenant
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={handleContact}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Contacter le prestataire
                    </Button>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ThumbsUp className="w-4 h-4 text-secondary" />
                      <span>Satisfaction garantie ou remboursé</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span>Prestataire vérifié et assuré</span>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                  Partager ce service
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
