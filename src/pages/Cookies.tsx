import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Cookie, BarChart3, Shield, Settings } from 'lucide-react';

const Cookies = () => {
  const cookieTypes = [
    { icon: Shield, title: 'Cookies essentiels', desc: 'Nécessaires au fonctionnement du site (authentification, sécurité, préférences). Ils ne peuvent pas être désactivés.', required: true },
    { icon: BarChart3, title: 'Cookies analytiques', desc: 'Nous aident à comprendre comment les visiteurs utilisent le site pour améliorer nos services.', required: false },
    { icon: Settings, title: 'Cookies fonctionnels', desc: 'Permettent de mémoriser vos préférences (langue, localisation, thème) pour une meilleure expérience.', required: false },
    { icon: Cookie, title: 'Cookies marketing', desc: 'Utilisés pour vous proposer des contenus pertinents. Nous ne faisons pas de publicité ciblée.', required: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de Cookies</h1>
        <p className="text-muted-foreground mb-12">Dernière mise à jour : 15 mars 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Qu'est-ce qu'un cookie ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de stocker des informations relatives à votre navigation pour améliorer votre expérience utilisateur.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Types de cookies utilisés</h2>
          <div className="grid gap-4">
            {cookieTypes.map((c) => (
              <div key={c.title} className="flex gap-4 bg-card rounded-xl p-5 border border-border">
                <c.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{c.title}</h3>
                    {c.required && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Obligatoire</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Gérer vos cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti lorsqu'un cookie est déposé. Notez que la désactivation de certains cookies peut affecter le fonctionnement du site.
          </p>
          <div className="mt-4 bg-muted rounded-xl p-5">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies<br />
              <strong className="text-foreground">Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies<br />
              <strong className="text-foreground">Safari :</strong> Préférences → Confidentialité → Cookies<br />
              <strong className="text-foreground">Edge :</strong> Paramètres → Cookies et autorisations
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question concernant notre utilisation des cookies, contactez-nous à{' '}
            <strong className="text-foreground">privacy@fixit.fr</strong>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
