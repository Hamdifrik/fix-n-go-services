import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Mentions Légales</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
            <div className="bg-card rounded-xl p-6 border border-border space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">Raison sociale :</strong> FixIt SAS</p>
              <p><strong className="text-foreground">Siège social :</strong> Paris, France</p>
              <p><strong className="text-foreground">Capital social :</strong> 10 000 €</p>
              <p><strong className="text-foreground">RCS :</strong> Paris B 123 456 789</p>
              <p><strong className="text-foreground">N° TVA :</strong> FR 12 345678901</p>
              <p><strong className="text-foreground">Directeur de la publication :</strong> Le Président de FixIt SAS</p>
              <p><strong className="text-foreground">Email :</strong> contact@fixit.fr</p>
              <p><strong className="text-foreground">Téléphone :</strong> 06 73 48 07 19</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Hébergeur</h2>
            <div className="bg-card rounded-xl p-6 border border-border space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">Nom :</strong> Lovable / Vercel</p>
              <p><strong className="text-foreground">Adresse :</strong> San Francisco, USA</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'ensemble des contenus du site FixIt (textes, images, logos, icônes, logiciels) est protégé par le droit d'auteur et le droit des marques. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Données personnelles</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez de droits sur vos données personnelles. Pour plus d'informations, consultez notre{' '}
              <a href="/privacy" className="text-primary hover:underline">Politique de Confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur. Pour en savoir plus, consultez notre{' '}
              <a href="/cookies" className="text-primary hover:underline">Politique de Cookies</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Médiation</h2>
            <p className="text-muted-foreground leading-relaxed">
              En cas de litige, le consommateur peut recourir gratuitement au service de médiation. Le médiateur peut être saisi dans un délai d'un an à compter de la réclamation écrite adressée à FixIt.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
