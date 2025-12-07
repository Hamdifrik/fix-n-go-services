import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, Shield, TrendingUp } from 'lucide-react';

const CTASection = () => {
  const helperBenefits = [
    { icon: TrendingUp, text: 'Développez votre activité' },
    { icon: Shield, text: 'Paiements sécurisés' },
    { icon: Users, text: 'Nouveaux clients chaque jour' },
    { icon: Briefcase, text: 'Flexibilité totale' },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - For Clients */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Besoin d'un dépannage ?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Créez votre demande gratuitement et recevez des propositions de professionnels qualifiés en quelques minutes.
            </p>
            <Link to="/register?role=client">
              <Button 
                size="xl" 
                className="bg-white text-primary hover:bg-white/90 hover:shadow-xl"
              >
                Créer une demande gratuite
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Right - For Helpers */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous êtes professionnel ?
            </h3>
            <p className="text-white/80 mb-6">
              Rejoignez notre communauté de Helpers et développez votre activité.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {helperBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/90 text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Link to="/register?role=helper">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full"
              >
                Devenir Helper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
