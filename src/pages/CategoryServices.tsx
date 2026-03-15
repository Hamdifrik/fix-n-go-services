import { useParams, Link } from 'react-router-dom';
import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench, Zap, Key, Flame, Wind, Paintbrush, DoorOpen, GlassWater, ArrowLeft } from 'lucide-react';
import { CATEGORY_LABELS, ServiceCategory } from '@/types/service';

const categoryData: Record<string, {
  icon: any;
  color: string;
  hero: string;
  description: string;
  services: { title: string; desc: string; price: string }[];
  tips: string[];
}> = {
  plomberie: {
    icon: Wrench,
    color: 'from-blue-500 to-blue-600',
    hero: 'Trouvez un plombier qualifié près de chez vous en quelques clics.',
    description: 'Fuite d\'eau, robinet cassé, chauffe-eau en panne, débouchage de canalisation — nos Helpers plombiers interviennent rapidement pour résoudre tous vos problèmes de plomberie.',
    services: [
      { title: 'Réparation de fuite', desc: 'Détection et réparation de fuites sur tuyaux, raccords et robinets', price: 'À partir de 60€' },
      { title: 'Débouchage canalisation', desc: 'Débouchage mécanique ou haute pression de vos canalisations', price: 'À partir de 80€' },
      { title: 'Installation sanitaire', desc: 'Pose de WC, lavabo, douche, baignoire, robinetterie', price: 'À partir de 120€' },
      { title: 'Chauffe-eau', desc: 'Réparation, entretien ou remplacement de chauffe-eau', price: 'À partir de 90€' },
    ],
    tips: ['Coupez l\'arrivée d\'eau en cas de fuite', 'Vérifiez régulièrement les joints de vos robinets', 'Faites entretenir votre chauffe-eau chaque année'],
  },
  electricite: {
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    hero: 'Un électricien certifié pour tous vos travaux électriques.',
    description: 'Panne de courant, installation de prises, mise aux normes, tableau électrique — nos Helpers électriciens sont qualifiés et certifiés pour intervenir en toute sécurité.',
    services: [
      { title: 'Dépannage électrique', desc: 'Diagnostic et réparation de pannes, courts-circuits, disjoncteurs', price: 'À partir de 70€' },
      { title: 'Installation de prises', desc: 'Pose de prises, interrupteurs, luminaires, détecteurs', price: 'À partir de 50€' },
      { title: 'Mise aux normes', desc: 'Mise en conformité de votre installation électrique (NF C 15-100)', price: 'Sur devis' },
      { title: 'Tableau électrique', desc: 'Remplacement ou modernisation de tableau électrique', price: 'À partir de 200€' },
    ],
    tips: ['Ne touchez jamais un fil dénudé', 'Faites vérifier votre installation tous les 10 ans', 'Utilisez des multiprises avec protection contre les surtensions'],
  },
  serrurerie: {
    icon: Key,
    color: 'from-gray-600 to-gray-700',
    hero: 'Serrurier de confiance disponible 24h/24, 7j/7.',
    description: 'Porte claquée, serrure bloquée, remplacement de cylindre, blindage de porte — nos Helpers serruriers interviennent rapidement à toute heure.',
    services: [
      { title: 'Ouverture de porte', desc: 'Ouverture sans dégât de porte claquée ou fermée à clé', price: 'À partir de 80€' },
      { title: 'Changement de serrure', desc: 'Remplacement de serrure, cylindre ou barillet', price: 'À partir de 100€' },
      { title: 'Blindage de porte', desc: 'Installation de porte blindée ou renforcement de porte existante', price: 'À partir de 300€' },
      { title: 'Double de clés', desc: 'Reproduction de clés standard ou haute sécurité', price: 'À partir de 15€' },
    ],
    tips: ['Gardez toujours un double chez un voisin de confiance', 'Évitez de forcer une serrure bloquée', 'Privilégiez les serrures certifiées A2P'],
  },
  chauffage: {
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    hero: 'Chauffagiste professionnel pour votre confort thermique.',
    description: 'Entretien de chaudière, installation de radiateurs, plancher chauffant, pompe à chaleur — nos Helpers chauffagistes assurent votre confort toute l\'année.',
    services: [
      { title: 'Entretien chaudière', desc: 'Entretien annuel obligatoire de votre chaudière gaz ou fioul', price: 'À partir de 90€' },
      { title: 'Réparation chauffage', desc: 'Diagnostic et réparation de panne de chauffage', price: 'À partir de 80€' },
      { title: 'Installation radiateurs', desc: 'Pose de radiateurs électriques, à eau ou à inertie', price: 'À partir de 150€' },
      { title: 'Pompe à chaleur', desc: 'Installation et entretien de pompe à chaleur air/eau', price: 'Sur devis' },
    ],
    tips: ['Faites entretenir votre chaudière chaque année', 'Purgez vos radiateurs avant l\'hiver', 'Réglez votre thermostat à 19°C pour économiser'],
  },
  climatisation: {
    icon: Wind,
    color: 'from-cyan-500 to-teal-500',
    hero: 'Installation et entretien de climatisation par des pros.',
    description: 'Clim réversible, split, gainable, entretien — nos Helpers climaticiens installent et entretiennent votre système pour un confort optimal été comme hiver.',
    services: [
      { title: 'Installation clim', desc: 'Pose de climatiseur split, multi-split ou gainable', price: 'À partir de 500€' },
      { title: 'Entretien clim', desc: 'Nettoyage de filtres, recharge de fluide, vérification', price: 'À partir de 80€' },
      { title: 'Dépannage clim', desc: 'Diagnostic et réparation de panne de climatisation', price: 'À partir de 90€' },
      { title: 'Clim réversible', desc: 'Installation de pompe à chaleur air/air réversible', price: 'Sur devis' },
    ],
    tips: ['Nettoyez les filtres tous les 2 mois', 'Faites entretenir votre clim chaque année', 'Ne descendez pas en dessous de 5°C d\'écart avec l\'extérieur'],
  },
  vitrerie: {
    icon: GlassWater,
    color: 'from-sky-400 to-blue-400',
    hero: 'Vitrier professionnel pour tous vos besoins en vitrerie.',
    description: 'Remplacement de vitre cassée, double vitrage, miroirs sur mesure, vitrine — nos Helpers vitriers interviennent avec précision et rapidité.',
    services: [
      { title: 'Remplacement vitre', desc: 'Changement de vitre simple ou double vitrage cassée', price: 'À partir de 80€' },
      { title: 'Double vitrage', desc: 'Installation de fenêtres double ou triple vitrage', price: 'À partir de 200€' },
      { title: 'Miroir sur mesure', desc: 'Découpe et pose de miroirs aux dimensions souhaitées', price: 'À partir de 60€' },
      { title: 'Vitrine commerciale', desc: 'Remplacement ou pose de vitrine pour commerce', price: 'Sur devis' },
    ],
    tips: ['Sécurisez immédiatement une vitre cassée avec du carton', 'Privilégiez le double vitrage pour l\'isolation', 'Faites appel à un pro pour les grandes surfaces vitrées'],
  },
  peinture: {
    icon: Paintbrush,
    color: 'from-purple-500 to-pink-500',
    hero: 'Peintre professionnel pour embellir votre intérieur.',
    description: 'Peinture intérieure, extérieure, ravalement de façade, papier peint — nos Helpers peintres donnent un coup de neuf à votre habitat.',
    services: [
      { title: 'Peinture intérieure', desc: 'Mise en peinture de murs, plafonds, boiseries', price: 'À partir de 25€/m²' },
      { title: 'Peinture extérieure', desc: 'Ravalement de façade, peinture de volets et portails', price: 'À partir de 30€/m²' },
      { title: 'Papier peint', desc: 'Pose et dépose de papier peint, toile de verre', price: 'À partir de 20€/m²' },
      { title: 'Enduit et finition', desc: 'Rebouchage, ponçage, enduit de lissage, finitions', price: 'À partir de 15€/m²' },
    ],
    tips: ['Préparez bien vos murs avant de peindre', 'Choisissez une peinture adaptée à la pièce (cuisine, salle de bain)', 'Aérez bien pendant et après les travaux'],
  },
  menuiserie: {
    icon: DoorOpen,
    color: 'from-amber-600 to-yellow-700',
    hero: 'Menuisier qualifié pour vos projets bois et aménagement.',
    description: 'Portes, fenêtres, placards, étagères, meubles sur mesure — nos Helpers menuisiers réalisent vos projets d\'aménagement avec savoir-faire.',
    services: [
      { title: 'Pose de porte', desc: 'Installation de porte intérieure, porte d\'entrée, porte coulissante', price: 'À partir de 150€' },
      { title: 'Placard sur mesure', desc: 'Conception et installation de rangements sur mesure', price: 'À partir de 300€' },
      { title: 'Pose de parquet', desc: 'Installation de parquet massif, contrecollé ou stratifié', price: 'À partir de 30€/m²' },
      { title: 'Réparation bois', desc: 'Réparation de meubles, volets, escaliers, charpente', price: 'À partir de 60€' },
    ],
    tips: ['Le bois massif nécessite un traitement régulier', 'Mesurez toujours deux fois avant de couper', 'Choisissez un bois adapté à l\'usage (intérieur/extérieur)'],
  },
};

const CategoryServices = () => {
  const { category } = useParams<{ category: string }>();
  const data = category ? categoryData[category] : null;
  const label = category ? CATEGORY_LABELS[category as ServiceCategory] || category : '';

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <SmartNavbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Catégorie non trouvée</h1>
          <Link to="/services"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voir tous les services</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main>
        {/* Hero */}
        <section className={`py-20 bg-gradient-to-br ${data.color} text-white`}>
          <div className="container mx-auto px-4">
            <Link to="/services" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6">
              <ArrowLeft className="w-4 h-4" /> Tous les services
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">{label}</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">{data.hero}</p>
          </div>
        </section>

        {/* Description */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos prestations {label.toLowerCase()}</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {data.services.map((s) => (
                <div key={s.title} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{s.title}</h3>
                    <span className="text-primary font-bold text-sm whitespace-nowrap ml-4">{s.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Conseils pratiques</h2>
            <ul className="space-y-4">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                  <p className="text-muted-foreground pt-1">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Besoin d'un {label.toLowerCase()} ?</h2>
            <p className="text-muted-foreground mb-8">Trouvez un Helper qualifié près de chez vous en quelques clics.</p>
            <Link to={`/services?category=${category}`}>
              <Button variant="hero" size="xl">
                Voir les Helpers disponibles <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryServices;
