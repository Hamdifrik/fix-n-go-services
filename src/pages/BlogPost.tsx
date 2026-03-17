import { useParams, Link } from 'react-router-dom';
import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { ChevronLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BLOG_POSTS: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}> = {
  '10-astuces-plomberie': {
    title: '10 astuces pour entretenir votre plomberie',
    category: 'Plomberie',
    date: '12 mars 2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=600&fit=crop',
    content: [
      "La plomberie est l'un des éléments essentiels de votre maison. Un entretien régulier permet d'éviter des pannes coûteuses et des dégâts des eaux. Voici nos 10 astuces incontournables.",
      "**1. Vérifiez régulièrement vos joints** — Les joints usés sont la cause principale des fuites. Inspectez les joints de vos robinets, douches et baignoires tous les 6 mois.",
      "**2. Nettoyez vos siphons** — Un siphon encrassé peut provoquer des mauvaises odeurs et des bouchons. Démontez-le et nettoyez-le au moins une fois par trimestre.",
      "**3. Évitez les produits chimiques** — Les déboucheurs chimiques endommagent vos canalisations. Privilégiez les méthodes mécaniques (ventouse, furet) ou naturelles (bicarbonate + vinaigre).",
      "**4. Surveillez votre compteur d'eau** — Relevez votre compteur le soir et le matin. Si les chiffres ont changé sans consommation, vous avez peut-être une fuite invisible.",
      "**5. Protégez vos tuyaux du gel** — En hiver, isolez les canalisations exposées au froid avec de la mousse isolante. Un tuyau gelé peut éclater et causer des dégâts considérables.",
      "**6. Ne jetez rien dans les toilettes** — Lingettes, cotons-tiges, graisses… ces déchets bouchent les canalisations. Seul le papier toilette est biodégradable.",
      "**7. Entretenez votre chauffe-eau** — Faites détartrer votre chauffe-eau tous les 2 ans par un professionnel pour maintenir ses performances et sa durée de vie.",
      "**8. Vérifiez la pression d'eau** — Une pression trop forte (> 3 bars) use prématurément vos équipements. Installez un réducteur de pression si nécessaire.",
      "**9. Remplacez les flexibles** — Les flexibles de machine à laver et de lave-vaisselle doivent être changés tous les 5 ans pour éviter les ruptures.",
      "**10. Faites appel à un professionnel** — En cas de doute, ne bricolez pas. Un plombier qualifié diagnostiquera rapidement le problème et évitera les mauvaises surprises.",
      "**En résumé**, un entretien régulier et quelques gestes simples suffisent à préserver votre installation de plomberie. Sur FixIt, trouvez un plombier qualifié près de chez vous en quelques clics.",
    ],
  },
  'choisir-electricien': {
    title: 'Comment choisir le bon électricien ?',
    category: 'Électricité',
    date: '8 mars 2026',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop',
    content: [
      "Choisir un électricien ne se fait pas à la légère. Une installation électrique défaillante peut être dangereuse. Voici les critères essentiels pour faire le bon choix.",
      "**Vérifiez les qualifications** — Un bon électricien doit posséder une certification Qualifelec ou une attestation de conformité. Demandez toujours à voir ses diplômes et certifications.",
      "**Exigez un devis détaillé** — Un professionnel sérieux fournit un devis précis comprenant : le coût de la main-d'œuvre, le prix des matériaux, le délai d'intervention et les garanties.",
      "**Consultez les avis clients** — Les retours d'expérience sont précieux. Sur FixIt, chaque électricien est noté par ses clients précédents, ce qui vous permet de faire un choix éclairé.",
      "**Vérifiez l'assurance** — Tout électricien doit disposer d'une assurance responsabilité civile professionnelle. Elle vous protège en cas de dommages causés pendant l'intervention.",
      "**Comparez les prix** — Les tarifs peuvent varier du simple au double. N'hésitez pas à demander plusieurs devis. Sur FixIt, comparez facilement les prix et les avis de dizaines de professionnels.",
      "**Privilégiez la proximité** — Un artisan local sera plus réactif et les frais de déplacement seront réduits. Utilisez la géolocalisation FixIt pour trouver les électriciens les plus proches.",
      "En suivant ces conseils, vous trouverez un électricien fiable et compétent pour tous vos travaux.",
    ],
  },
  'preparer-maison-hiver': {
    title: "Préparer sa maison pour l'hiver",
    category: 'Chauffage',
    date: '1 mars 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=600&fit=crop',
    content: [
      "L'hiver approche et votre maison mérite une préparation minutieuse. Chauffage, isolation, entretien : voici le guide complet pour passer la saison froide sereinement.",
      "**Faites réviser votre chaudière** — L'entretien annuel est obligatoire. Un chauffagiste vérifiera le bon fonctionnement, nettoiera les composants et contrôlera les émissions de CO.",
      "**Purgez vos radiateurs** — L'air emprisonné dans les radiateurs réduit leur efficacité. Purgez-les avant la mise en route du chauffage pour un rendement optimal.",
      "**Vérifiez l'isolation** — Fenêtres, portes, combles… Les déperditions thermiques représentent jusqu'à 30% de votre facture énergétique. Calfeutrez les ouvertures et renforcez l'isolation si nécessaire.",
      "**Protégez les canalisations extérieures** — Coupez l'alimentation des robinets extérieurs et vidangez les tuyaux exposés pour éviter le gel.",
      "**Nettoyez les gouttières** — Les feuilles mortes bouchent les gouttières et provoquent des infiltrations. Nettoyez-les avant les premières pluies d'hiver.",
      "**Programmez votre thermostat** — 19°C dans les pièces à vivre, 16°C dans les chambres la nuit. Un thermostat programmable vous fait économiser jusqu'à 15% sur votre facture.",
      "Avec ces gestes préventifs, vous passerez un hiver confortable tout en maîtrisant votre budget énergie. Besoin d'un professionnel ? Trouvez-le sur FixIt !",
    ],
  },
  'serrure-bloquee-urgence': {
    title: 'Serrure bloquée : que faire en urgence ?',
    category: 'Serrurerie',
    date: '25 février 2026',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&h=600&fit=crop',
    content: [
      "Vous êtes devant votre porte et la serrure refuse de s'ouvrir ? Pas de panique. Voici les bons réflexes à avoir et les erreurs à éviter.",
      "**Gardez votre calme** — Forcer la serrure ou la clé risque d'aggraver la situation. Prenez un moment pour évaluer le problème avant d'agir.",
      "**Essayez les gestes simples** — Vaporisez du lubrifiant (WD-40) dans le barillet. Essayez de tourner la clé doucement en la soulevant légèrement.",
      "**Ne forcez jamais la clé** — Une clé cassée dans la serrure complique considérablement l'intervention et augmente le coût de réparation.",
      "**Méfiez-vous des arnaques** — En situation d'urgence, certains serruriers peu scrupuleux gonflent les prix. Demandez toujours un devis AVANT l'intervention, même par téléphone.",
      "**Faites appel à un serrurier de confiance** — Sur FixIt, tous les serruriers sont vérifiés et notés. Vous pouvez comparer les prix et lire les avis même en urgence depuis votre téléphone.",
      "**Prévention** — Faites dupliquer vos clés chez un professionnel et confiez un double à un voisin de confiance. Entretenez vos serrures en les lubrifiant 2 fois par an.",
      "Un serrurier FixIt peut intervenir en moins de 30 minutes dans votre quartier. Ne restez pas bloqué dehors !",
    ],
  },
  'renover-cuisine': {
    title: 'Rénover sa cuisine : par où commencer ?',
    category: 'Menuiserie',
    date: '20 février 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
    content: [
      "Rénover sa cuisine est un projet excitant mais qui demande une bonne planification. Peinture, menuiserie, électricité : voici comment procéder étape par étape.",
      "**Étape 1 : Définissez votre budget** — La rénovation d'une cuisine coûte entre 5 000€ et 25 000€ selon l'ampleur des travaux. Prévoyez toujours 10% de marge pour les imprévus.",
      "**Étape 2 : Planifiez l'agencement** — Respectez le triangle d'activité (évier, réfrigérateur, plaque de cuisson). Chaque côté du triangle ne doit pas dépasser 2,5 mètres.",
      "**Étape 3 : Commencez par le gros œuvre** — Plomberie, électricité, cloisons… Les travaux structurels doivent être réalisés en premier par des professionnels qualifiés.",
      "**Étape 4 : La menuiserie** — Installez les meubles de cuisine, le plan de travail et les rangements. Un menuisier professionnel assurera des finitions impeccables.",
      "**Étape 5 : La peinture et les finitions** — Choisissez une peinture lessivable adaptée aux pièces humides. Posez la crédence et les accessoires en dernier.",
      "**Conseil FixIt** — Plutôt que de gérer plusieurs artisans, utilisez FixIt pour trouver des professionnels de chaque spécialité. Lisez les avis, comparez les prix et réservez en quelques clics.",
    ],
  },
  'climatisation-reversible': {
    title: 'Les avantages de la climatisation réversible',
    category: 'Climatisation',
    date: '15 février 2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&h=600&fit=crop',
    content: [
      "La climatisation réversible est devenue un équipement incontournable. Chauffage en hiver, fraîcheur en été : découvrez tous les avantages de ce système 2-en-1.",
      "**Un confort toute l'année** — La clim réversible chauffe en hiver et rafraîchit en été. Plus besoin de deux systèmes distincts, un seul appareil suffit.",
      "**Des économies d'énergie** — Une pompe à chaleur air-air consomme 3 fois moins d'énergie qu'un chauffage électrique classique. Votre facture peut diminuer de 30 à 50%.",
      "**Un système écologique** — En utilisant les calories de l'air extérieur, la climatisation réversible réduit votre empreinte carbone par rapport aux énergies fossiles.",
      "**Une installation simple** — Un technicien qualifié installe votre système en une journée. L'unité extérieure et les splits intérieurs sont reliés par des liaisons frigorifiques discrètes.",
      "**Un air purifié** — Les modèles récents intègrent des filtres qui captent poussières, allergènes et bactéries. L'air intérieur est plus sain, idéal pour les personnes allergiques.",
      "**Les aides financières** — MaPrimeRénov', CEE, TVA réduite… De nombreuses aides existent pour financer votre installation. Renseignez-vous auprès de votre installateur.",
      "**Entretien** — Un entretien annuel par un professionnel est recommandé : nettoyage des filtres, vérification du fluide frigorigène et contrôle des performances.",
      "Sur FixIt, trouvez un installateur de climatisation certifié près de chez vous. Comparez les devis et lisez les avis pour faire le meilleur choix.",
    ],
  },
};

const SLUG_MAP: Record<string, string> = {
  '10-astuces-plomberie': '10-astuces-plomberie',
  'choisir-electricien': 'choisir-electricien',
  'preparer-maison-hiver': 'preparer-maison-hiver',
  'serrure-bloquee-urgence': 'serrure-bloquee-urgence',
  'renover-cuisine': 'renover-cuisine',
  'climatisation-reversible': 'climatisation-reversible',
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? BLOG_POSTS[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SmartNavbar />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Link to="/blog">
            <Button>Retour au blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const otherSlugs = Object.keys(BLOG_POSTS).filter(s => s !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative aspect-[21/9] max-h-[400px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link to="/blog" className="flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Retour au blog
              </Link>
              <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-3 text-white">{post.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/70">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} de lecture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-lg max-w-none">
              {post.content.map((paragraph, i) => {
                // Handle bold markers
                const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-6">
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="text-foreground font-semibold">{part}</strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                );
              })}
            </article>

            {/* CTA */}
            <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <h3 className="text-xl font-bold mb-2">Besoin d'un professionnel ?</h3>
              <p className="text-muted-foreground mb-4">Trouvez un expert qualifié près de chez vous sur FixIt</p>
              <Link to="/services">
                <Button variant="hero" size="lg">Trouver un prestataire</Button>
              </Link>
            </div>

            {/* Related articles */}
            {otherSlugs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {otherSlugs.map((s) => {
                    const related = BLOG_POSTS[s];
                    return (
                      <Link key={s} to={`/blog/${s}`} className="group">
                        <div className="aspect-[3/2] rounded-xl overflow-hidden mb-3">
                          <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <span className="text-xs text-primary font-medium">{related.category}</span>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
