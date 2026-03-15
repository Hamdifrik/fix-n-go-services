import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  FileText, Users, MessageSquare, CheckCircle2, CreditCard, Star,
  ArrowRight, Shield, Clock, MapPin, Headphones
} from 'lucide-react';

const HowItWorks = () => {
  const clientSteps = [
    { icon: FileText, title: 'Décrivez votre besoin', desc: 'Remplissez un formulaire simple avec la description du problème, des photos si possible, et votre adresse. C\'est gratuit et sans engagement.', color: 'bg-primary' },
    { icon: Users, title: 'Recevez des propositions', desc: 'Les Helpers qualifiés proches de chez vous voient votre demande et vous envoient leurs devis détaillés avec prix et disponibilités.', color: 'bg-blue-500' },
    { icon: MessageSquare, title: 'Échangez et choisissez', desc: 'Comparez les profils, les avis et les tarifs. Utilisez le chat intégré pour poser vos questions et affiner les détails.', color: 'bg-secondary' },
    { icon: CreditCard, title: 'Réservez en sécurité', desc: 'Payez en ligne de manière sécurisée. Le montant est bloqué jusqu\'à validation du travail effectué.', color: 'bg-green-500' },
    { icon: CheckCircle2, title: 'Validez l\'intervention', desc: 'Une fois le travail terminé, le Helper soumet pour validation. Confirmez la qualité du travail pour débloquer le paiement.', color: 'bg-emerald-500' },
    { icon: Star, title: 'Laissez un avis', desc: 'Partagez votre expérience pour aider la communauté. Votre avis aide les futurs clients à faire le bon choix.', color: 'bg-amber-500' },
  ];

  const guarantees = [
    { icon: Shield, title: 'Paiement sécurisé', desc: 'Votre argent est protégé jusqu\'à validation du travail' },
    { icon: Clock, title: 'Réponse rapide', desc: 'Recevez des propositions en moins de 30 minutes' },
    { icon: MapPin, title: 'Helpers locaux', desc: 'Des professionnels vérifiés proches de chez vous' },
    { icon: Headphones, title: 'Support 7j/7', desc: 'Notre équipe est là pour vous accompagner' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Comment fonctionne FixIt ?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un processus simple, transparent et sécurisé pour trouver le bon professionnel en quelques clics.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Pour les Clients</h2>
            <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">6 étapes simples pour résoudre votre problème</p>
            <div className="max-w-3xl mx-auto space-y-8">
              {clientSteps.map((step, i) => (
                <div key={step.title} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {i < clientSteps.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos garanties</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((g) => (
                <div key={g.title} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <g.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                  <p className="text-muted-foreground text-sm">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Inscrivez-vous gratuitement et trouvez un Helper en quelques minutes.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Trouver un Helper <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/helpers">
                <Button variant="outline" size="xl">Devenir Helper</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
