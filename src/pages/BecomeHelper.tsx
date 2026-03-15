import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  UserPlus, FileCheck, Briefcase, Star, ArrowRight,
  TrendingUp, Calendar, Shield, Banknote
} from 'lucide-react';

const BecomeHelper = () => {
  const steps = [
    { icon: UserPlus, title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement en quelques minutes. Renseignez vos coordonnées et choisissez « Helper » comme rôle.' },
    { icon: FileCheck, title: 'Complétez votre profil', desc: 'Ajoutez vos compétences, certifications, zones d\'intervention et une photo professionnelle. Un profil complet inspire confiance.' },
    { icon: Briefcase, title: 'Publiez vos services', desc: 'Décrivez vos prestations, fixez vos tarifs et ajoutez des photos de vos réalisations. Vous êtes libre de gérer votre offre.' },
    { icon: Star, title: 'Recevez des demandes', desc: 'Les clients proches de vous voient vos services. Acceptez les missions qui vous conviennent et développez votre activité.' },
  ];

  const benefits = [
    { icon: Banknote, title: 'Revenus flexibles', desc: 'Fixez vos propres tarifs et choisissez vos missions. Pas de commission cachée.' },
    { icon: Calendar, title: 'Agenda libre', desc: 'Travaillez quand vous voulez. Acceptez ou refusez les missions selon vos disponibilités.' },
    { icon: Shield, title: 'Paiement garanti', desc: 'Le paiement est sécurisé et garanti. Vous êtes payé dès que le client valide le travail.' },
    { icon: TrendingUp, title: 'Visibilité locale', desc: 'Apparaissez dans les recherches de votre zone. Plus vous avez d\'avis positifs, plus vous êtes visible.' },
  ];

  const stats = [
    { value: '2 500+', label: 'Helpers actifs' },
    { value: '15 000+', label: 'Missions réalisées' },
    { value: '4.8/5', label: 'Note moyenne' },
    { value: '45€/h', label: 'Revenu moyen' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-medium text-sm mb-6">
              Rejoignez la communauté FixIt
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Devenez Helper sur FixIt</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Développez votre activité, trouvez des clients près de chez vous et soyez payé en toute sécurité.
            </p>
            <Link to="/register">
              <Button variant="hero" size="xl">
                S'inscrire gratuitement <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-muted-foreground text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Comment devenir Helper ?</h2>
            <p className="text-muted-foreground text-center mb-16">4 étapes simples pour démarrer</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={step.title} className="relative bg-card rounded-2xl p-6 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="absolute top-4 right-4 text-4xl font-bold text-muted/30">{i + 1}</span>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi rejoindre FixIt ?</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4 bg-card rounded-xl p-6 border border-border">
                  <b.icon className="w-10 h-10 text-secondary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-muted-foreground text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Prêt à vous lancer ?</h2>
            <p className="text-muted-foreground mb-8">L'inscription est gratuite et prend moins de 5 minutes.</p>
            <Link to="/register">
              <Button variant="hero" size="xl">
                Devenir Helper maintenant <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeHelper;
