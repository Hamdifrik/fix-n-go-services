import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : 15 mars 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation de la plateforme FixIt (ci-après « la Plateforme »), accessible à l'adresse fixit.fr, ainsi que les droits et obligations des utilisateurs.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              FixIt est une plateforme de mise en relation entre des particuliers ou professionnels recherchant des services de dépannage à domicile (ci-après « les Clients ») et des prestataires de services qualifiés (ci-après « les Helpers »).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Inscription et Compte</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'utilisation de la Plateforme nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription. L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Être âgé d'au moins 18 ans</li>
              <li>Fournir une adresse email valide</li>
              <li>Ne créer qu'un seul compte par personne</li>
              <li>Ne pas usurper l'identité d'un tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Services proposés</h2>
            <p className="text-muted-foreground leading-relaxed">
              FixIt propose un service de mise en relation. La Plateforme n'est pas partie au contrat de prestation conclu entre le Client et le Helper. FixIt ne garantit pas la qualité, la sécurité ou la légalité des services proposés par les Helpers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Obligations des Helpers</h2>
            <p className="text-muted-foreground leading-relaxed">Les Helpers s'engagent à :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Disposer des compétences et qualifications nécessaires</li>
              <li>Respecter les délais convenus avec le Client</li>
              <li>Fournir un travail de qualité conforme à la description du service</li>
              <li>Disposer des assurances professionnelles requises</li>
              <li>Respecter la réglementation en vigueur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Obligations des Clients</h2>
            <p className="text-muted-foreground leading-relaxed">Les Clients s'engagent à :</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Fournir des informations exactes sur le service demandé</li>
              <li>Assurer un accès sécurisé au lieu d'intervention</li>
              <li>Procéder au paiement dans les délais prévus</li>
              <li>Valider ou contester l'intervention dans un délai raisonnable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Paiement et Tarification</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le paiement est sécurisé via la Plateforme. Les fonds sont bloqués jusqu'à la validation de l'intervention par le Client. FixIt prélève une commission sur chaque transaction. Les tarifs sont librement fixés par les Helpers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Évaluations et Avis</h2>
            <p className="text-muted-foreground leading-relaxed">
              Après chaque intervention, le Client peut laisser un avis et une note. Les avis doivent être sincères, respectueux et fondés sur une expérience réelle. FixIt se réserve le droit de supprimer tout avis ne respectant pas ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              FixIt agit en qualité d'intermédiaire et ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de la Plateforme ou de l'exécution des prestations par les Helpers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Résiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'utilisateur peut résilier son compte à tout moment. FixIt se réserve le droit de suspendre ou de supprimer un compte en cas de non-respect des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Droit applicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
