import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Package, 
  Euro, 
  Image as ImageIcon,
  Check,
  Plus,
  X,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import { useCreateService } from '@/hooks/useServices';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  serrurerie: 'Serrurerie',
  chauffage: 'Chauffage',
  climatisation: 'Climatisation',
  menuiserie: 'Menuiserie',
  peinture: 'Peinture',
  menage: 'Ménage',
  jardinage: 'Jardinage',
  mecanique: 'Mécanique',
  vitrerie: 'Vitrerie',
  autre: 'Autre',
};

type ServiceCategory = keyof typeof CATEGORY_LABELS;

interface ServiceFormData {
  title: string;
  description: string;
  category: ServiceCategory | '';
  price: number;
  duration: number;
  tags: string[];
  images: string[];
}

const HelperCreateService = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: 60,
    tags: [],
    images: [],
  });

  const createService = useCreateService();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'helper') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const categories: ServiceCategory[] = [
    'plomberie', 'electricite', 'serrurerie', 'chauffage', 
    'climatisation', 'menuiserie', 'peinture', 'menage', 
    'jardinage', 'mecanique', 'vitrerie', 'autre'
  ];

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 5) {
      setFormData({ 
        ...formData, 
        tags: [...formData.tags, newTag.trim().toLowerCase()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const isStep1Valid = formData.title && formData.description && formData.category;
  const isStep2Valid = formData.price > 0 && formData.duration > 0;

  const handleSubmit = async () => {
    await createService.mutateAsync({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      duration: formData.duration,
      images: formData.images,
      tags: formData.tags,
    });

    navigate('/helper/dashboard');
  };

  const steps = [
    { num: 1, label: 'Description' },
    { num: 2, label: 'Tarification' },
    { num: 3, label: 'Photos & Tags' },
    { num: 4, label: 'Aperçu' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-6">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Créer un nouveau service</h1>
            <p className="text-muted-foreground">Publiez votre service pour recevoir des réservations</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0",
                    step >= s.num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={cn(
                    "hidden sm:inline text-sm whitespace-nowrap",
                    step >= s.num ? "font-medium" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 md:w-16 h-0.5 mx-2 flex-shrink-0",
                    step > s.num ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Step 1: Description */}
            {step === 1 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Décrivez votre service
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Catégorie *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleInputChange('category', cat)}
                          className={cn(
                            "p-3 rounded-xl border text-sm text-left transition-all",
                            formData.category === cat
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {CATEGORY_LABELS[cat]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Titre du service *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Réparation fuite d'eau - Intervention rapide"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      maxLength={80}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.title.length}/80 caractères
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez en détail ce que vous proposez..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/500 caractères
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    variant="hero" 
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {step === 2 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Euro className="w-5 h-5 text-primary" />
                  Définissez votre tarif
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="price">Prix (€) *</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        placeholder="50"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Durée estimée (minutes) *</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 60, 90, 120, 180, 240].map((dur) => (
                        <button
                          key={dur}
                          onClick={() => handleInputChange('duration', dur)}
                          className={cn(
                            "p-3 rounded-xl border text-sm transition-all",
                            formData.duration === dur
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {dur < 60 ? `${dur} min` : `${dur/60}h`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={() => setStep(3)}
                    disabled={!isStep2Valid}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Photos & Tags */}
            {step === 3 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Photos et mots-clés
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Photos du service (optionnel)</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <div 
                          key={index}
                          className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="text-center text-muted-foreground">
                            <Plus className="w-8 h-8 mx-auto mb-1" />
                            <span className="text-xs">Ajouter</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ajoutez jusqu'à 3 photos de vos réalisations
                    </p>
                  </div>

                  <div>
                    <Label className="mb-3 block">Mots-clés (max. 5)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Ex: urgence, rapide..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addTag}
                        disabled={formData.tags.length >= 5}
                      >
                        Ajouter
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Retour
                  </Button>
                  <Button variant="hero" onClick={() => setStep(4)}>
                    Aperçu
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Aperçu de votre service
                </h2>

                <div className="border border-border rounded-xl overflow-hidden mb-6">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {formData.category && CATEGORY_LABELS[formData.category]}
                      </span>
                      <span className="text-secondary font-bold">
                        {formData.price}€
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{formData.title || 'Titre du service'}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.description || 'Description du service...'}
                    </p>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                  <h3 className="font-medium mb-2">Récapitulatif</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Catégorie</span>
                      <span className="font-medium">{formData.category && CATEGORY_LABELS[formData.category]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-medium">{formData.price}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-medium">
                        {formData.duration < 60 ? `${formData.duration} min` : `${formData.duration/60}h`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Retour
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={handleSubmit}
                    disabled={createService.isPending}
                  >
                    {createService.isPending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Publier le service'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelperCreateService;
