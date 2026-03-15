import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, ArrowRight, Heart, Rocket, Users } from 'lucide-react';

const Careers = () => {
  const values = [
    { icon: Heart, title: 'Impact réel', desc: 'Nous aidons des milliers de personnes à résoudre leurs problèmes du quotidien.' },
    { icon: Rocket, title: 'Innovation', desc: 'Nous repoussons les limites de la technologie pour simplifier la vie de nos utilisateurs.' },
    { icon: Users, title: 'Équipe soudée', desc: 'Une culture bienveillante où chacun peut s\'épanouir et progresser.' },
  ];

  const jobs = [
    { title: 'Développeur Full Stack', dept: 'Tech', location: 'Paris / Remote', type: 'CDI' },
    { title: 'Product Designer', dept: 'Design', location: 'Paris', type: 'CDI' },
    { title: 'Customer Success Manager', dept: 'Support', location: 'Paris', type: 'CDI' },
    { title: 'Growth Marketing Manager', dept: 'Marketing', location: 'Paris / Remote', type: 'CDI' },
    { title: 'Stagiaire Data Analyst', dept: 'Data', location: 'Paris', type: 'Stage' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      <main>
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Rejoignez l'aventure FixIt</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous construisons la plateforme qui transforme le dépannage à domicile. Rejoignez une équipe passionnée.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div key={v.title} className="text-center">
                  <v.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{v.title}</h3>
                  <p className="text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Openings */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Postes ouverts</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.title} className="bg-card rounded-xl p-5 border border-border flex items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.dept}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{job.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Postuler <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Vous ne trouvez pas le poste idéal ? Envoyez une candidature spontanée à{' '}
              <strong className="text-foreground">jobs@fixit.fr</strong>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
