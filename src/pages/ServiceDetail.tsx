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
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockServices, mockReviews } from '@/data/mockServices';
import { CATEGORY_LABELS, PRICING_TYPE_LABELS } from '@/types/service';
import { cn } from '@/lib/utils';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const service = mockServices.find(s => s.id === id);
  const reviews = mockReviews.filter(r => r.serviceId === id);

  if (!service) {
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

  const formatPrice = () => {
    if (service.pricingType === 'hourly') {
      return `${service.price}€/h`;
    }
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
    navigate(`/book/${service.id}`);
  };

  const handleContact = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Ouvrir le chat avec le helper
    console.log('Contact helper:', service.helperId);
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
                    src={service.images[selectedImage] || '/placeholder.svg'}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {service.images.map((img, index) => (
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
                    {CATEGORY_LABELS[service.category]}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    {service.rating} ({service.reviewCount} avis)
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h1>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Helper Profile */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">À propos du prestataire</h2>
                
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xl">
                    {service.helper.firstName.charAt(0)}{service.helper.lastName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">
                        {service.helper.firstName} {service.helper.lastName}
                      </h3>
                      {service.helper.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {service.helper.location}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <p className="text-xl font-bold text-primary">{service.helper.rating}</p>
                        <p className="text-xs text-muted-foreground">Note moyenne</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <p className="text-xl font-bold">{service.helper.completedJobs}</p>
                        <p className="text-xs text-muted-foreground">Missions</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <p className="text-xl font-bold">{service.helper.responseTime}min</p>
                        <p className="text-xs text-muted-foreground">Temps de réponse</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-xl">
                        <p className="text-xl font-bold">{service.helper.reviewCount}</p>
                        <p className="text-xs text-muted-foreground">Avis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Avis clients ({reviews.length})
                </h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-card rounded-xl border border-border p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                              {review.clientName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{review.clientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {review.createdAt.toLocaleDateString('fr-FR')}
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
                        
                        {review.helperResponse && (
                          <div className="mt-4 pl-4 border-l-2 border-primary">
                            <p className="text-sm font-medium mb-1">Réponse du prestataire</p>
                            <p className="text-sm text-muted-foreground">{review.helperResponse}</p>
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
                    <p className="text-muted-foreground">
                      {service.pricingType === 'fixed' ? 'Prix forfaitaire' : 'Tarif horaire'}
                    </p>
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
