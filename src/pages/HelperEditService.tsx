import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Package, 
  Euro, 
  Image as ImageIcon,
  Save,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SmartNavbar from '@/components/layout/SmartNavbar';
import { useService, useUpdateService, useDeleteService } from '@/hooks/useServices';
import { ImageUpload } from '@/components/chat/ImageUpload';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

const HelperEditService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: serviceResponse, isLoading } = useService(id || '');
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ServiceCategory | '',
    price: 0,
    duration: 60,
    tags: [] as string[],
    images: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (serviceResponse?.data) {
      const s = serviceResponse.data;
      setFormData({
        title: s.title || '',
        description: s.description || '',
        category: (s.category || '') as ServiceCategory,
        price: s.price || 0,
        duration: s.duration || 60,
        tags: s.tags || [],
        images: s.images || [],
        isActive: s.isActive !== false,
      });
    }
  }, [serviceResponse]);

  const categories: ServiceCategory[] = [
    'plomberie', 'electricite', 'serrurerie', 'chauffage', 
    'climatisation', 'menuiserie', 'peinture', 'menage', 
    'jardinage', 'mecanique', 'vitrerie', 'autre'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim().toLowerCase()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSave = async () => {
    if (!id) return;
    await updateService.mutateAsync({ id, data: formData as any });
    navigate('/helper/dashboard');
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteService.mutateAsync(id);
    navigate('/helper/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SmartNavbar />
        <div className="pt-20 flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />
      
      <main className="pt-20">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-6">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Modifier le service</h1>
                <p className="text-muted-foreground">Mettez à jour les informations de votre service</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes les données liées à ce service seront perdues.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Description */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Description
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Catégorie</Label>
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
                  <Label htmlFor="title">Titre du service</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    maxLength={80}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Euro className="w-5 h-5 text-primary" />
                Tarification
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="price">Prix (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Durée estimée</Label>
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

                {/* Active toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-medium">Service actif</p>
                    <p className="text-sm text-muted-foreground">Visible dans le catalogue</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      formData.isActive ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
                      formData.isActive ? "translate-x-6" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Photos & Tags */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Photos et mots-clés
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Photos</Label>
                  <ImageUpload
                    value={formData.images}
                    onChange={(urls) => handleInputChange('images', urls)}
                    maxFiles={3}
                    category="services"
                  />
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
                    <Button type="button" variant="outline" onClick={addTag} disabled={formData.tags.length >= 5}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {tag}
                          <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <Button 
                variant="hero" 
                onClick={handleSave}
                disabled={updateService.isPending || !formData.title || !formData.category || formData.price <= 0}
                className="gap-2"
              >
                {updateService.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelperEditService;
