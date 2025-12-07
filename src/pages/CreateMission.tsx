import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Wrench, 
  ArrowLeft, 
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Upload,
  Image,
  X,
  AlertTriangle,
  Zap,
  FileText,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceType, SERVICE_LABELS, MissionUrgency, URGENCY_LABELS } from '@/types';

const CreateMission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    serviceType: '' as ServiceType | '',
    title: '',
    description: '',
    urgency: 'normal' as MissionUrgency,
    address: '',
    city: '',
    postalCode: '',
    preferredDate: '',
    preferredTime: '',
    estimatedBudget: '',
  });

  const services: { type: ServiceType; icon: string; color: string }[] = [
    { type: 'plomberie', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
    { type: 'electricite', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { type: 'serrurerie', icon: '🔑', color: 'from-purple-500 to-pink-500' },
    { type: 'chauffage', icon: '🔥', color: 'from-red-500 to-orange-500' },
    { type: 'climatisation', icon: '❄️', color: 'from-teal-500 to-cyan-500' },
    { type: 'vitrerie', icon: '🪟', color: 'from-sky-500 to-blue-500' },
    { type: 'menuiserie', icon: '🪚', color: 'from-amber-500 to-yellow-600' },
    { type: 'peinture', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  ];

  const urgencyOptions = [
    { value: 'normal' as MissionUrgency, icon: Clock, label: 'Normal', description: 'Dans les prochains jours', color: 'border-border' },
    { value: 'urgent' as MissionUrgency, icon: Zap, label: 'Urgent', description: 'Dans les 24h', color: 'border-warning' },
    { value: 'emergency' as MissionUrgency, icon: AlertTriangle, label: 'Urgence absolue', description: 'Maintenant', color: 'border-destructive' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Mission créée avec succès !",
        description: "Vous recevrez des propositions de Helpers très bientôt.",
      });
      navigate('/dashboard');
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.serviceType;
      case 2: return formData.title && formData.description;
      case 3: return formData.address && formData.city && formData.postalCode;
      case 4: return true;
      default: return false;
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Nouvelle mission</h1>
              <p className="text-sm text-muted-foreground">Étape {step} sur {totalSteps}</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary-foreground" />
            </div>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Quel service recherchez-vous ?</h2>
              <p className="text-muted-foreground">Sélectionnez le type de dépannage dont vous avez besoin.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.type}
                  onClick={() => setFormData({ ...formData, serviceType: service.type })}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-center transition-all hover-lift",
                    formData.serviceType === service.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <p className="font-medium text-sm">{SERVICE_LABELS[service.type]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Décrivez votre problème</h2>
              <p className="text-muted-foreground">Plus vous êtes précis, meilleures seront les propositions.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la mission *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Fuite sous l'évier de la cuisine"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le problème en détail : depuis quand, la gravité, ce que vous avez déjà essayé..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                />
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <Label>Photos du problème (optionnel)</Label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-xs">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Maximum 5 photos</p>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label>Niveau d'urgence</Label>
                <div className="grid grid-cols-3 gap-3">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, urgency: option.value })}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all",
                        formData.urgency === option.value
                          ? `${option.color} bg-primary/5`
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <option.icon className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        option.value === 'urgent' && "text-warning",
                        option.value === 'emergency' && "text-destructive"
                      )} />
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Où se situe l'intervention ?</h2>
              <p className="text-muted-foreground">L'adresse exacte permettra aux Helpers de vous trouver facilement.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Numéro et nom de rue"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    placeholder="75015"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              {/* Map placeholder */}
              <div className="h-48 rounded-xl bg-muted flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Carte interactive</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule & Budget */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Quand et quel budget ?</h2>
              <p className="text-muted-foreground">Définissez vos préférences pour l'intervention.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date souhaitée</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Créneau horaire</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget estimé (optionnel)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="100"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Le budget final sera défini avec le Helper sélectionné.
                </p>
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Récapitulatif de votre mission
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{formData.serviceType ? SERVICE_LABELS[formData.serviceType] : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titre</span>
                    <span className="font-medium">{formData.title || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgence</span>
                    <span className="font-medium">{URGENCY_LABELS[formData.urgency]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lieu</span>
                    <span className="font-medium">{formData.city || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Photos</span>
                    <span className="font-medium">{photos.length} photo(s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto max-w-2xl flex gap-3">
          {step > 1 && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1 gap-2"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Continuer
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1 gap-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Publier ma mission
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMission;
