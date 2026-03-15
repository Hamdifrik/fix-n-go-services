import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const Privacy = () => {
  const highlights = [
    { icon: Shield, title: 'Données protégées', desc: 'Chiffrement de bout en bout' },
    { icon: Eye, title: 'Transparence totale', desc: 'Vous savez ce qu\'on collecte' },
    { icon: Lock, title: 'Pas de revente', desc: 'Vos données ne sont jamais vendues' },
    { icon: UserCheck, title: 'Vos droits', desc: 'Accès, modification, suppression' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de Confidentialité</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : 15 mars 2026</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {highlights.map((h) => (
            <div key={h.title} className="bg-card border border-border rounded-xl p-4 text-center">
              <h.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-sm">{h.title}</p>
              <p className="text-xs text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Données collectées</h2>
            <p className="text-muted-foreground leading-relaxed">Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li><strong>Données d'identification</strong> : nom, prénom, email, téléphone, photo de profil</li>
              <li><strong>Données de localisation</strong> : adresse, coordonnées GPS (avec votre consentement)</li>
              <li><strong>Données de transaction</strong> : historique des réservations, paiements</li>
              <li><strong>Données d'usage</strong> : pages visitées, actions effectuées, appareil utilisé</li>
              <li><strong>Données de communication</strong> : messages échangés via le chat</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Finalités du traitement</h2>
            <p className="text-muted-foreground leading-relaxed">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Gérer votre compte et authentifier votre identité</li>
              <li>Mettre en relation Clients et Helpers</li>
              <li>Traiter les paiements de manière sécurisée</li>
              <li>Améliorer nos services et l'expérience utilisateur</li>
              <li>Vous envoyer des notifications relatives à vos réservations</li>
              <li>Prévenir la fraude et assurer la sécurité de la Plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Base légale</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le traitement de vos données repose sur : l'exécution du contrat (CGU), votre consentement, notre intérêt légitime, et le respect de nos obligations légales conformément au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Durée de conservation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données sont conservées pendant la durée de votre inscription, puis 3 ans après la suppression de votre compte pour des raisons légales. Les données de paiement sont conservées 10 ans conformément aux obligations comptables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Partage des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données ne sont jamais vendues. Elles peuvent être partagées avec : les autres utilisateurs (profil public), nos prestataires techniques (hébergement, paiement), les autorités compétentes sur demande légale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Vos droits (RGPD)</h2>
            <p className="text-muted-foreground leading-relaxed">Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Pour exercer vos droits, contactez-nous à : <strong className="text-foreground">privacy@fixit.fr</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Sécurité</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement SSL/TLS, authentification sécurisée, audits de sécurité réguliers, accès restreint aux données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact DPO</h2>
            <p className="text-muted-foreground leading-relaxed">
              Notre Délégué à la Protection des Données est joignable à : <strong className="text-foreground">dpo@fixit.fr</strong>. Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
