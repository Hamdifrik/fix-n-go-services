import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceFiltersComponent from '@/components/services/ServiceFilters';
import { mockServices } from '@/data/mockServices';
import { ServiceFilters } from '@/types/service';

const Services = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ServiceFilters>({
    sortBy: 'relevance'
  });

  // Filtrer et trier les services
  const filteredServices = useMemo(() => {
    let result = [...mockServices];

    // Filtre par recherche
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.helper.location.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (filters.category) {
      result = result.filter(service => service.category === filters.category);
    }

    // Filtre par prix
    if (filters.minPrice !== undefined) {
      result = result.filter(service => service.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(service => service.price <= filters.maxPrice!);
    }

    // Filtre par note
    if (filters.minRating) {
      result = result.filter(service => service.rating >= filters.minRating!);
    }

    // Tri
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Pertinence: tri par nombre d'avis et note
        result.sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating));
    }

    return result;
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, query });
  };

  const handleBook = (serviceId: string) => {
    // Vérifier si l'utilisateur est connecté
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
              {filteredServices.length} services disponibles près de chez vous
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
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
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
