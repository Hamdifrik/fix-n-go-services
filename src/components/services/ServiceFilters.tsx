import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ServiceFilters as FiltersType, ServiceCategory, CATEGORY_LABELS } from '@/types/service';
import { cn } from '@/lib/utils';

interface ServiceFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onSearch: (query: string) => void;
  className?: string;
}

const ServiceFiltersComponent = ({ filters, onFiltersChange, onSearch, className }: ServiceFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 200
  ]);

  const categories: ServiceCategory[] = [
    'plomberie', 'electricite', 'serrurerie', 'chauffage', 
    'climatisation', 'menuiserie', 'peinture', 'menage', 
    'jardinage', 'mecanique', 'vitrerie', 'autre'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: ServiceCategory, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating
    });
  };

  const handleSortChange = (sortBy: FiltersType['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSearchQuery('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.minRating;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category === category}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label 
                htmlFor={`category-${category}`} 
                className="text-sm font-normal cursor-pointer"
              >
                {CATEGORY_LABELS[category]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="font-semibold mb-3">Prix</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={200}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€+</span>
          </div>
        </div>
      </div>

      {/* Note minimum */}
      <div>
        <h3 className="font-semibold mb-3">Note minimum</h3>
        <div className="flex gap-2">
          {[4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-colors",
                filters.minRating === rating
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              )}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Tri */}
      <div>
        <h3 className="font-semibold mb-3">Trier par</h3>
        <div className="space-y-2">
          {[
            { value: 'relevance', label: 'Pertinence' },
            { value: 'price_asc', label: 'Prix croissant' },
            { value: 'price_desc', label: 'Prix décroissant' },
            { value: 'rating', label: 'Mieux notés' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value as FiltersType['sortBy'])}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                filters.sortBy === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton réinitialiser */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un service... (ex: plombier Paris)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-24 h-12"
          />
          <Button 
            type="submit" 
            variant="hero" 
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          >
            Rechercher
          </Button>
        </div>
      </form>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowMobileFilters(true)}
          className="w-full gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FiltersContent />
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-background z-50 lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Filtres</h2>
            <button onClick={() => setShowMobileFilters(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <FiltersContent />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
            <Button 
              variant="hero" 
              className="w-full"
              onClick={() => setShowMobileFilters(false)}
            >
              Voir les résultats
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceFiltersComponent;
