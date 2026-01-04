import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service, CATEGORY_LABELS, PRICING_TYPE_LABELS } from '@/types/service';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onBook?: () => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const formatPrice = () => {
    if (service.pricingType === 'hourly') {
      return `${service.price}€/h`;
    }
    return `${service.price}€`;
  };

  const formatDuration = () => {
    if (service.duration < 60) {
      return `${service.duration} min`;
    }
    const hours = Math.floor(service.duration / 60);
    const mins = service.duration % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={service.images[0] || '/placeholder.svg'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium">
          {CATEGORY_LABELS[service.category]}
        </span>
        {/* Price Badge */}
        <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
          {formatPrice()}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDuration()}
          </span>
          {service.helper.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {service.helper.location}
            </span>
          )}
        </div>

        {/* Helper Info */}
        <div className="flex items-center gap-3 py-3 border-t border-border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            {service.helper.avatar ? (
              <img src={service.helper.avatar} alt={service.helper.firstName} className="w-full h-full object-cover" />
            ) : (
              `${service.helper.firstName.charAt(0)}${service.helper.lastName.charAt(0)}`
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm truncate">
                {service.helper.firstName} {service.helper.lastName.charAt(0)}.
              </span>
              {service.helper.isVerified && (
                <BadgeCheck className="w-4 h-4 text-secondary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                {service.helper.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span>{service.helper.completedJobs} missions</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link to={`/services/${service.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Voir détails
            </Button>
          </Link>
          <Button 
            variant="hero" 
            className="flex-1"
            onClick={onBook}
          >
            Réserver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
