import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Map, LayoutGrid, Navigation } from 'lucide-react';
import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceFiltersComponent from '@/components/services/ServiceFilters';
import { ServiceMap, useClientLocation } from '@/components/maps/ServiceMap';
import { useServices } from '@/hooks/useServices';
import { ServiceFilters } from '@/types/service';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || undefined;
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  const [filters, setFilters] = useState<ServiceFilters>({
    category: initialCategory as any,
    sortBy: 'relevance'
  });

  const { location: clientLocation, loading: locationLoading, requestLocation } = useClientLocation();

  // Appel API pour récupérer les services
  const { data: servicesResponse, isLoading, error } = useServices({
    category: filters.category,
    search: filters.query,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    limit: 50,
  });

  // Transformer les données API en format compatible avec l'UI
  const filteredServices = useMemo(() => {
    if (!servicesResponse?.data) return [];
    
    let result = servicesResponse.data.map((service: any) => {
      const loc = service.location?.coordinates;
      const serviceLat = loc ? loc[1] : null;
      const serviceLng = loc ? loc[0] : null;
      
      let distance: number | undefined;
      if (clientLocation && serviceLat && serviceLng) {
        distance = calculateDistance(clientLocation.lat, clientLocation.lng, serviceLat, serviceLng);
      }

      return {
        id: service._id,
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        pricingType: 'fixed' as const,
        duration: service.duration,
        rating: service.helper?.rating || 4.5,
        reviewCount: service.helper?.totalReviews || 0,
        images: service.images?.length > 0 ? service.images : ['/placeholder.svg'],
        tags: service.tags || [],
        helperId: typeof service.helper === 'string' ? service.helper : service.helper?._id,
        helper: {
          id: typeof service.helper === 'string' ? service.helper : service.helper?._id || '',
          firstName: service.helper?.firstName || 'Helper',
          lastName: service.helper?.lastName || '',
          rating: service.helper?.rating || 4.5,
          reviewCount: service.helper?.totalReviews || 0,
          completedJobs: 0,
          location: service.location?.address || 'France',
          isVerified: service.helper?.isVerified || false,
          responseTime: 30,
        },
        isActive: service.isActive,
        createdAt: new Date(service.createdAt),
        distance,
        lat: serviceLat,
        lng: serviceLng,
      };
    });

    // Filtre par note
    if (filters.minRating) {
      result = result.filter((service: any) => service.rating >= filters.minRating!);
    }

    // Tri
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case 'relevance':
      default:
        // If client location available, sort by distance first
        if (clientLocation) {
          result.sort((a: any, b: any) => {
            const distA = a.distance ?? Infinity;
            const distB = b.distance ?? Infinity;
            return distA - distB;
          });
        } else {
          result.sort((a: any, b: any) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating));
        }
    }

    return result;
  }, [servicesResponse, filters.minRating, filters.sortBy, clientLocation]);

  // Services with location for map
  const mapServices = useMemo(() => {
    return filteredServices
      .filter((s: any) => s.lat && s.lng)
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        price: s.price,
        category: s.category,
        lat: s.lat,
        lng: s.lng,
        helperName: `${s.helper.firstName} ${s.helper.lastName}`,
        distance: s.distance,
      }));
  }, [filteredServices]);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, query });
  };

  const handleBook = (serviceId: string) => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Trouvez le service parfait
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isLoading ? 'Chargement...' : `${filteredServices.length} services disponibles`}
                  {clientLocation && ' • Triés par proximité'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Location button */}
                {!clientLocation ? (
                  <Button 
                    variant="outline" 
                    onClick={requestLocation} 
                    disabled={locationLoading}
                    className="gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    {locationLoading ? 'Localisation...' : 'Activer ma position'}
                  </Button>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-primary font-medium px-3 py-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    Position activée
                  </span>
                )}
                {/* View toggle */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'map' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <ServiceFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSearch={handleSearch}
                />
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {/* Map View */}
              {viewMode === 'map' && (
                <div className="mb-6">
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Map className="w-5 h-5 text-primary" />
                        Carte des services
                        {mapServices.length > 0 && (
                          <span className="text-sm font-normal text-muted-foreground">
                            ({mapServices.length} sur la carte)
                          </span>
                        )}
                      </h3>
                      {!clientLocation && (
                        <Button variant="ghost" size="sm" onClick={requestLocation} className="gap-1 text-xs">
                          <Navigation className="w-3 h-3" />
                          Activer position
                        </Button>
                      )}
                    </div>
                    {mapServices.length > 0 ? (
                      <ServiceMap
                        services={mapServices}
                        clientLocation={clientLocation}
                        onServiceClick={(id) => navigate(`/services/${id}`)}
                        className="h-[500px]"
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Aucun service avec localisation disponible</p>
                          <p className="text-sm">Les helpers doivent ajouter leur position lors de la création de service</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border">
                      <Skeleton className="aspect-[4/3]" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                  <p className="text-muted-foreground">
                    Impossible de charger les services. Veuillez réessayer.
                  </p>
                </div>
              ) : filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service: any) => (
                    <div key={service.id} className="relative">
                      {service.distance !== undefined && (
                        <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {service.distance.toFixed(1)} km
                        </div>
                      )}
                      <ServiceCard
                        service={service}
                        onBook={() => handleBook(service.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Aucun service trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
