import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SERVICE_LABELS, ServiceType } from '@/types';

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [location, setLocation] = useState('');

  const popularServices: ServiceType[] = ['plomberie', 'electricite', 'serrurerie', 'chauffage'];

  const handleSearch = () => {
    navigate('/register?role=client');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>+10 000 interventions réalisées</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Trouvez un{' '}
            <span className="gradient-text">professionnel</span>
            <br />
            pour tous vos dépannages
          </h1>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Plomberie, électricité,mécanicien, serrurerie... Connectez-vous avec des Helpers qualifiés près de chez vous, 
            disponibles 7j/7 avec paiement sécurisé.
          </p>

          {/* Barre de recherche */}
          <div className="bg-card rounded-2xl shadow-card p-3 md:p-4 max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col md:flex-row gap-3">
              {/* Sélection du service */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-muted/50 border-0 text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Quel service recherchez-vous ?</option>
                  {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Localisation */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Votre ville ou code postal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-muted/50 border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Bouton recherche */}
              <Button 
                variant="hero" 
                size="xl" 
                onClick={handleSearch}
                className="md:w-auto"
              >
                Trouver un Helper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Services populaires */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Populaires :</span>
              {popularServices.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className="px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm transition-colors"
                >
                  {SERVICE_LABELS[service]}
                </button>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-2xl md:text-3xl font-bold">100%</span>
              </div>
              <p className="text-sm text-muted-foreground">Paiement sécurisé</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold">&lt;30min</span>
              </div>
              <p className="text-sm text-muted-foreground">Temps de réponse</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-warning" />
                <span className="text-2xl md:text-3xl font-bold">7j/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Disponibilité</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
