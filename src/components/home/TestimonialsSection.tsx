import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Cliente',
      location: 'Paris 15ème',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Service impeccable ! Mon plombier est arrivé en moins d\'une heure pour une fuite urgente. Travail propre et professionnel. Je recommande vivement FixIt.',
      service: 'Plomberie',
    },
    {
      id: 2,
      name: 'Jean-Pierre Martin',
      role: 'Client',
      location: 'Lyon 6ème',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Excellent rapport qualité-prix. L\'électricien a remis aux normes tout mon tableau électrique. Le système de paiement sécurisé est vraiment rassurant.',
      service: 'Électricité',
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      role: 'Cliente',
      location: 'Bordeaux',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Bloquée dehors à 22h, le serrurier est venu en 20 minutes. Très professionnel et tarif transparent. Merci FixIt !',
      service: 'Serrurerie',
    },
    {
      id: 4,
      name: 'Thomas Leroy',
      role: 'Helper',
      location: 'Marseille',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'En tant que plombier indépendant, FixIt m\'a permis de développer ma clientèle. Les paiements sont rapides et le système est vraiment bien pensé.',
      service: 'Plomberie',
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des milliers de clients et Helpers satisfaits nous font confiance chaque jour.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-0 md:left-8 opacity-10">
            <Quote className="w-24 h-24 text-primary" />
          </div>

          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-5 h-5",
                            i < testimonial.rating ? "text-warning fill-warning" : "text-muted"
                          )} 
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                        />
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role} • {testimonial.location}
                          </p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {testimonial.service}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    index === activeIndex 
                      ? "bg-primary w-8" 
                      : "bg-muted hover:bg-primary/50"
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
