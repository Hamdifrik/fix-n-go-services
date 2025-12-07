import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  Key, 
  Flame, 
  Wind, 
  LayoutGrid,
  Paintbrush,
  Hammer,
  ArrowRight
} from 'lucide-react';
import { ServiceType, SERVICE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

const ServicesSection = () => {
  const services = [
    { 
      type: 'plomberie' as ServiceType, 
      icon: Droplets, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      description: 'Fuites, débouchage, installation sanitaire'
    },
    { 
      type: 'electricite' as ServiceType, 
      icon: Zap, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Pannes, installation, mise aux normes'
    },
    { 
      type: 'serrurerie' as ServiceType, 
      icon: Key, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      description: 'Ouverture, remplacement, sécurisation'
    },
    { 
      type: 'chauffage' as ServiceType, 
      icon: Flame, 
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      description: 'Chaudière, radiateurs, entretien'
    },
    { 
      type: 'climatisation' as ServiceType, 
      icon: Wind, 
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-500/10',
      description: 'Installation, réparation, entretien'
    },
    { 
      type: 'vitrerie' as ServiceType, 
      icon: LayoutGrid, 
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-500/10',
      description: 'Remplacement, double vitrage, sécurité'
    },
    { 
      type: 'peinture' as ServiceType, 
      icon: Paintbrush, 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      description: 'Intérieur, extérieur, décoration'
    },
    { 
      type: 'menuiserie' as ServiceType, 
      icon: Hammer, 
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-500/10',
      description: 'Portes, fenêtres, aménagement'
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tous les services dont vous avez besoin
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des professionnels vérifiés et qualifiés pour tous vos travaux de dépannage et d'aménagement à domicile.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Link
              key={service.type}
              to={`/services/${service.type}`}
              className="group relative bg-card rounded-2xl p-6 hover-lift border border-border/50 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient on Hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                service.bgColor
              )} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  service.color
                )}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {SERVICE_LABELS[service.type]}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm font-medium mr-2">En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Voir tous nos services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
