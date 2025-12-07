import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Décrivez votre besoin',
      description: 'Créez une demande en décrivant votre problème avec photos et localisation. C\'est gratuit et sans engagement.',
      color: 'from-primary to-blue-400',
    },
    {
      number: '02',
      icon: Users,
      title: 'Recevez des propositions',
      description: 'Les Helpers qualifiés proches de chez vous reçoivent votre demande et vous envoient leurs devis.',
      color: 'from-blue-400 to-secondary',
    },
    {
      number: '03',
      icon: MessageSquare,
      title: 'Choisissez votre Helper',
      description: 'Comparez les profils, avis et tarifs. Échangez par chat pour affiner les détails de l\'intervention.',
      color: 'from-secondary to-green-400',
    },
    {
      number: '04',
      icon: CheckCircle2,
      title: 'Validez et payez en sécurité',
      description: 'Le paiement est bloqué jusqu\'à validation du travail. Notez votre Helper après l\'intervention.',
      color: 'from-green-400 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça fonctionne ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et sécurisé pour trouver le bon professionnel en quelques clics.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-emerald-500" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="relative"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 hover-lift h-full">
                  {/* Number Badge */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 relative z-10`}>
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/register">
            <Button variant="hero" size="xl">
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
