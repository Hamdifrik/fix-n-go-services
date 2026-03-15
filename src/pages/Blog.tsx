import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: '10 astuces pour entretenir votre plomberie',
      excerpt: 'Découvrez les gestes simples pour éviter les pannes et prolonger la durée de vie de vos installations.',
      category: 'Plomberie',
      date: '12 mars 2026',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
    },
    {
      title: 'Comment choisir le bon électricien ?',
      excerpt: 'Les critères essentiels pour sélectionner un professionnel qualifié et éviter les mauvaises surprises.',
      category: 'Électricité',
      date: '8 mars 2026',
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
    },
    {
      title: 'Préparer sa maison pour l\'hiver',
      excerpt: 'Chauffage, isolation, entretien : le guide complet pour passer l\'hiver sereinement.',
      category: 'Chauffage',
      date: '1 mars 2026',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop',
    },
    {
      title: 'Serrure bloquée : que faire en urgence ?',
      excerpt: 'Les bons réflexes à avoir et les erreurs à éviter quand votre serrure ne fonctionne plus.',
      category: 'Serrurerie',
      date: '25 février 2026',
      readTime: '3 min',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    },
    {
      title: 'Rénover sa cuisine : par où commencer ?',
      excerpt: 'Peinture, menuiserie, électricité : planifiez votre projet de rénovation étape par étape.',
      category: 'Menuiserie',
      date: '20 février 2026',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    },
    {
      title: 'Les avantages de la climatisation réversible',
      excerpt: 'Chauffage en hiver, fraîcheur en été : tout savoir sur la clim réversible et son installation.',
      category: 'Climatisation',
      date: '15 février 2026',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1631545806609-35dbc2b1e6d1?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main>
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog FixIt</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conseils, astuces et actualités pour entretenir votre maison et trouver les meilleurs professionnels.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.title} className="bg-card rounded-2xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 cursor-pointer hover:gap-2 transition-all">
                      Lire la suite <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
