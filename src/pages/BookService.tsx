import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  CreditCard,
  Check,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useService } from '@/hooks/useServices';
import { useCreateBooking } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
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
  other: 'Autre',
};

interface BookingFormData {
  date: string;
  time: string;
  street: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
  notes: string;
}

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    street: '',
    city: '',
    postalCode: '',
    additionalInfo: '',
    notes: '',
  });

  const { data: serviceResponse, isLoading: isLoadingService } = useService(serviceId || '');
  const service = serviceResponse?.data;
  
  const createBooking = useCreateBooking();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  if (isLoadingService) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 rounded-2xl" />
            </div>
            <div>
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button>Retour au catalogue</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const helper = typeof service.helper === 'string' ? null : service.helper;

  const formatPrice = () => {
    return `${service.price}€`;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStep1Valid = formData.date && formData.time;
  const isStep2Valid = formData.street && formData.city && formData.postalCode;

  const handleSubmit = async () => {
    const scheduledDate = new Date(`${formData.date}T${formData.time}:00`);
    
    await createBooking.mutateAsync({
      serviceId: service._id,
      scheduledDate: scheduledDate.toISOString(),
      address: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.postalCode,
        country: 'France',
      },
      notes: formData.notes || undefined,
    });

    navigate('/dashboard');
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const steps = [
    { num: 1, label: 'Date & Heure' },
    { num: 2, label: 'Adresse' },
    { num: 3, label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au service
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s.num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={cn(
                    "hidden sm:inline text-sm",
                    step >= s.num ? "font-medium" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 md:w-24 h-0.5 mx-2",
                    step > s.num ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Choisissez une date et un horaire
                  </h2>

                  <div className="mb-6">
                    <Label className="mb-3 block">Date souhaitée</Label>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                      {availableDates.slice(0, 7).map((date) => {
                        const d = new Date(date);
                        const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
                        const dayNum = d.getDate();
                        return (
                          <button
                            key={date}
                            onClick={() => handleInputChange('date', date)}
                            className={cn(
                              "p-3 rounded-xl border text-center transition-all",
                              formData.date === date
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:border-primary"
                            )}
                          >
                            <p className="text-xs capitalize">{dayName}</p>
                            <p className="text-lg font-semibold">{dayNum}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Créneau horaire</Label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleInputChange('time', time)}
                          className={cn(
                            "p-3 rounded-xl border text-center transition-all",
                            formData.time === time
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary"
                          )}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <p className="font-medium">{time}</p>
                        </button>
                      ))}
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

              {/* Step 2: Address */}
              {step === 2 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Adresse d'intervention
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Adresse *</Label>
                      <Input
                        id="street"
                        placeholder="123 rue de la République"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          placeholder="75001"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          placeholder="Paris"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Complément d'adresse</Label>
                      <Input
                        id="additionalInfo"
                        placeholder="Bâtiment B, 3ème étage, code 1234"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes pour le prestataire</Label>
                      <Textarea
                        id="notes"
                        placeholder="Informations supplémentaires sur l'intervention..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                      />
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

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Récapitulatif & Paiement
                  </h2>

                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <h3 className="font-medium mb-3">Détails de la réservation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {new Date(formData.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heure</span>
                        <span className="font-medium">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse</span>
                        <span className="font-medium text-right">
                          {formData.street}, {formData.postalCode} {formData.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-secondary" />
                      <span className="font-medium">Paiement sécurisé</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Votre paiement sera mis en séquestre jusqu'à la validation du service.
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6">
                    En cliquant sur "Confirmer la réservation", vous acceptez nos{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      conditions générales de service
                    </Link>.
                  </p>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Retour
                    </Button>
                    <Button 
                      variant="hero" 
                      onClick={handleSubmit}
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Confirmer la réservation - {formatPrice()}</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Service Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-5">
                <div className="flex gap-4 mb-4">
                  <img
                    src={service.images?.[0] || '/placeholder.svg'}
                    alt={service.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-primary font-medium">
                      {CATEGORY_LABELS[service.category] || service.category}
                    </span>
                    <h3 className="font-semibold line-clamp-2">{service.title}</h3>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prestataire</span>
                    <span className="font-medium">
                      {helper ? `${helper.firstName} ${helper.lastName?.charAt(0)}.` : 'Helper'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Durée estimée</span>
                    <span className="font-medium">
                      {service.duration < 60 
                        ? `${service.duration} min` 
                        : `${Math.floor(service.duration / 60)}h${service.duration % 60 > 0 ? service.duration % 60 : ''}`
                      }
                    </span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-secondary">{formatPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookService;
