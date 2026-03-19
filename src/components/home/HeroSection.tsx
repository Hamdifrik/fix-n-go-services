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
  Users,
  Droplets,
  Zap,
  KeyRound,
  Flame,
  Wind,
  PanelTop,
  Paintbrush,
  Hammer,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { SERVICE_LABELS, ServiceType } from '@/types';
import { searchCities } from '@/data/frenchCities';
import heroBg from '@/assets/hero-bg.jpg';

const SERVICE_ICONS: Record<ServiceType, React.ElementType> = {
  plomberie: Droplets,
  electricite: Zap,
  serrurerie: KeyRound,
  chauffage: Flame,
  climatisation: Wind,
  vitrerie: PanelTop,
  peinture: Paintbrush,
  menuiserie: Hammer,
  autre: MoreHorizontal,
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  plomberie: 'text-blue-500 bg-blue-500/10',
  electricite: 'text-amber-500 bg-amber-500/10',
  serrurerie: 'text-slate-600 bg-slate-500/10',
  chauffage: 'text-orange-500 bg-orange-500/10',
  climatisation: 'text-cyan-500 bg-cyan-500/10',
  vitrerie: 'text-sky-400 bg-sky-400/10',
  peinture: 'text-pink-500 bg-pink-500/10',
  menuiserie: 'text-yellow-700 bg-yellow-700/10',
  autre: 'text-muted-foreground bg-muted',
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [location, setLocation] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCities, setShowCities] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  const popularServices: ServiceType[] = ['plomberie', 'electricite', 'serrurerie', 'chauffage'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowCities(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setShowServices(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    const results = searchCities(value);
    setCitySuggestions(results);
    setShowCities(results.length > 0);
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setShowCities(false);
  };

  const selectService = (service: ServiceType) => {
    setSelectedService(service);
    setShowServices(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set('category', selectedService);
    if (location) params.set('city', location);
    navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const SelectedIcon = selectedService ? SERVICE_ICONS[selectedService] : Search;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Équipe de professionnels FixIt" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>La plateforme n°1 du dépannage en France</span>
          </div>

          {/* Titre */}
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
              {/* Custom Service Selector */}
              <div className="flex-1 relative" ref={serviceRef}>
                <button
                  type="button"
                  onClick={() => setShowServices(!showServices)}
                  className="w-full flex items-center gap-3 pl-4 pr-4 py-3 md:py-4 rounded-xl bg-muted/50 text-left hover:bg-muted transition-colors"
                >
                  <SelectedIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className={selectedService ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedService ? SERVICE_LABELS[selectedService] : 'Quel service ?'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${showServices ? 'rotate-180' : ''}`} />
                </button>

                {showServices && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((key) => {
                      const Icon = SERVICE_ICONS[key];
                      const colorClass = SERVICE_COLORS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => selectService(key)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors text-sm ${
                            selectedService === key ? 'bg-primary/5 font-medium' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{SERVICE_LABELS[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Localisation avec autocomplétion */}
              <div className="flex-1 relative" ref={locationRef}>
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <input
                  type="text"
                  placeholder="Votre ville"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => { if (citySuggestions.length > 0) setShowCities(true); }}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-muted/50 border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {showCities && citySuggestions.length > 0 && (
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

              {/* Bouton */}
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
              {popularServices.map((service) => {
                const Icon = SERVICE_ICONS[service];
                return (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {SERVICE_LABELS[service]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Shield, value: '100%', label: 'Paiement sécurisé', color: 'text-secondary' },
              { icon: Clock, value: '<30min', label: 'Temps de réponse', color: 'text-primary' },
              { icon: Star, value: '4.8/5', label: 'Note moyenne', color: 'text-amber-500' },
              { icon: Users, value: '10K+', label: 'Interventions réussies', color: 'text-primary' },
            ].map((badge) => (
              <div key={badge.label} className="text-center p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30">
                <badge.icon className={`w-5 h-5 ${badge.color} mx-auto mb-2`} />
                <span className="text-2xl md:text-3xl font-bold block">{badge.value}</span>
                <p className="text-xs text-muted-foreground mt-1">{badge.label}</p>
              </div>
            ))}
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
