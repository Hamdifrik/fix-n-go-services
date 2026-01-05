import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceFiltersComponent from '@/components/services/ServiceFilters';
import { useServices } from '@/hooks/useServices';
import { ServiceFilters } from '@/types/service';
import { Skeleton } from '@/components/ui/skeleton';

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || undefined;
  
  const [filters, setFilters] = useState<ServiceFilters>({
    category: initialCategory as any,
    sortBy: 'relevance'
  });

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
    
    let result = servicesResponse.data.map((service: any) => ({
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
        location: 'France',
        isVerified: service.helper?.isVerified || false,
        responseTime: 30,
      },
      isActive: service.isActive,
      createdAt: new Date(service.createdAt),
    }));

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
      default:
        result.sort((a: any, b: any) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating));
    }

    return result;
  }, [servicesResponse, filters.minRating, filters.sortBy]);

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
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Trouvez le service parfait
            </h1>
            <p className="text-muted-foreground text-lg">
              {isLoading ? 'Chargement...' : `${filteredServices.length} services disponibles près de chez vous`}
            </p>
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

            {/* Services Grid */}
            <div className="flex-1">
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
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onBook={() => handleBook(service.id)}
                    />
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
