import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Shield, 
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import { SERVICE_LABELS, ServiceType } from '@/types';
import { searchCities } from '@/data/frenchCities';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [location, setLocation] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const popularServices: ServiceType[] = ['plomberie', 'electricite', 'serrurerie', 'chauffage'];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    const results = searchCities(value);
    setCitySuggestions(results);
    setShowSuggestions(results.length > 0);
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set('category', selectedService);
    if (location) params.set('city', location);
    navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Professionnel en intervention" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>La plateforme n°1 du dépannage en France</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
            Votre <span className="gradient-text">dépannage</span>
            <br />
            en un clic, <span className="gradient-text">garanti</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Plomberie, électricité, serrurerie, mécanicien... Des <strong className="text-foreground">Helpers certifiés</strong> près de chez vous, 
            disponibles <strong className="text-foreground">7j/7</strong> avec paiement 100% sécurisé.
          </p>

          {/* Barre de recherche */}
          <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-card p-3 md:p-4 max-w-3xl mx-auto animate-scale-in border border-border/50" style={{ animationDelay: '0.3s' }}>
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

              {/* Localisation avec autocomplétion */}
              <div className="flex-1 relative" ref={locationRef}>
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <input
                  type="text"
                  placeholder="Votre ville"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => { if (citySuggestions.length > 0) setShowSuggestions(true); }}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-muted/50 border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {/* City Suggestions Dropdown */}
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    {citySuggestions.map((city) => (
                      <button
                        key={city}
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors text-sm"
                      >
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                )}
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

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-2xl md:text-3xl font-bold block">100%</span>
              <p className="text-xs text-muted-foreground mt-1">Paiement sécurisé</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl md:text-3xl font-bold block">&lt;30min</span>
              <p className="text-xs text-muted-foreground mt-1">Temps de réponse</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-2xl md:text-3xl font-bold block">4.8/5</span>
              <p className="text-xs text-muted-foreground mt-1">Note moyenne</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl md:text-3xl font-bold block">10K+</span>
              <p className="text-xs text-muted-foreground mt-1">Interventions réussies</p>
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
