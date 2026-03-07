import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Star,
  User,
  Wrench,
  MessageSquare,
  Phone,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import SmartNavbar from '@/components/layout/SmartNavbar';
import Footer from '@/components/layout/Footer';
import { useBooking, useUpdateBookingStatus, useCancelBooking } from '@/hooks/useBookings';
import { useCreateReview } from '@/hooks/useReviews';
import { Booking, User as UserType, Service } from '@/lib/api';

const STATUS_STEPS = [
  { key: 'pending', label: 'En attente', description: 'La réservation a été envoyée au prestataire', icon: Clock },
  { key: 'confirmed', label: 'Confirmée', description: 'Le prestataire a accepté votre demande', icon: CheckCircle2 },
  { key: 'in-progress', label: 'En cours', description: "L'intervention est en cours", icon: Wrench },
  { key: 'awaiting-validation', label: 'Validation client', description: 'Le helper a terminé, en attente de confirmation du client', icon: ShieldCheck },
  { key: 'completed', label: 'Terminée', description: 'Le travail a été confirmé et validé par le client', icon: CheckCircle2 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  'in-progress': 'bg-primary',
  'awaiting-validation': 'bg-violet-500',
  completed: 'bg-secondary',
  cancelled: 'bg-destructive',
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: bookingResponse, isLoading } = useBooking(id || '');
  const updateStatus = useUpdateBookingStatus();
  const cancelBooking = useCancelBooking();
  const createReview = useCreateReview();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const booking = bookingResponse?.data as Booking | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SmartNavbar />
        <main className="pt-20 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-96 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <SmartNavbar />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Réservation introuvable</h1>
          <Link to="/dashboard">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </main>
      </div>
    );
  }

  const helper = typeof booking.helper === 'object' ? booking.helper as UserType : null;
  const client = typeof booking.client === 'object' ? booking.client as UserType : null;
  const service = typeof booking.service === 'object' ? booking.service as Service : null;
  const isClient = currentUser.role === 'client';
  const isHelper = currentUser.role === 'helper';
  const isCancelled = booking.status === 'cancelled';

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === booking.status);

  const handleCancel = async () => {
    await cancelBooking.mutateAsync({ id: booking._id, reason: cancelReason });
    setShowCancelForm(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    await updateStatus.mutateAsync({ id: booking._id, status: newStatus });
  };

  const handleClientReject = async () => {
    // Client rejects → back to in-progress
    await updateStatus.mutateAsync({ id: booking._id, status: 'in-progress' });
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleClientValidate = async () => {
    // Client confirms → completed
    await updateStatus.mutateAsync({ id: booking._id, status: 'completed' });
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewComment.trim()) return;
    await createReview.mutateAsync({
      bookingId: booking._id,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewSubmitted(true);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-background">
      <SmartNavbar />

      <main className="pt-20">
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Réservation #{booking._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-muted-foreground text-sm">
                Créée le {formatDate(booking.createdAt)}
              </p>
            </div>
            <Badge className={cn('text-sm px-4 py-1.5 text-white', STATUS_COLORS[booking.status] || 'bg-muted')}>
              {isCancelled
                ? 'Annulée'
                : STATUS_STEPS.find(s => s.key === booking.status)?.label || booking.status}
            </Badge>
          </div>

          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h2 className="text-lg font-semibold mb-6">Suivi de la réservation</h2>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-muted" />
                <div
                  className="absolute left-[18px] top-0 w-0.5 bg-primary transition-all duration-500"
                  style={{
                    height: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
                  }}
                />

                <div className="space-y-8">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = currentStepIndex === index;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all',
                            isCompleted
                              ? step.key === 'awaiting-validation' && isCurrent
                                ? 'bg-violet-500 text-white animate-pulse'
                                : 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={cn(
                              'font-medium',
                              isCurrent && 'text-primary',
                              !isCompleted && 'text-muted-foreground'
                            )}
                          >
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {isCurrent && step.key === 'completed' && booking.completedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Terminée le {formatDate(booking.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled info */}
          {isCancelled && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">Réservation annulée</h3>
                  {booking.cancelledAt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Annulée le {formatDate(booking.cancelledAt)}
                    </p>
                  )}
                  {booking.cancellationReason && (
                    <p className="text-sm mt-2">Raison : {booking.cancellationReason}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Info */}
              {service && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    Service réservé
                  </h3>
                  <div className="flex gap-4">
                    <img
                      src={service.images?.[0] || '/placeholder.svg'}
                      alt={service.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{service.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      <p className="text-lg font-bold text-secondary mt-1">{booking.totalPrice}€</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Address */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Détails de l'intervention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Heure</p>
                      <p className="font-medium">{formatDate(booking.scheduledDate)}</p>
                      <p className="font-medium">{formatTime(booking.scheduledDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">{booking.address.street}</p>
                      <p className="font-medium">{booking.address.zipCode} {booking.address.city}</p>
                    </div>
                  </div>
                </div>
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions for Helper */}
              {isHelper && !isCancelled && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {booking.status === 'pending' && (
                      <>
                        <Button variant="hero" onClick={() => handleStatusUpdate('confirmed')} disabled={updateStatus.isPending}>
                          Accepter la réservation
                        </Button>
                        <Button variant="outline" onClick={() => setShowCancelForm(true)}>
                          Refuser
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button variant="hero" onClick={() => handleStatusUpdate('in-progress')} disabled={updateStatus.isPending}>
                        Démarrer l'intervention
                      </Button>
                    )}
                    {booking.status === 'in-progress' && (
                      <div className="w-full space-y-3">
                        <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                          <p className="text-sm text-muted-foreground mb-2">
                            En marquant le travail comme terminé, le client devra confirmer que l'intervention est satisfaisante.
                          </p>
                          <Button 
                            className="bg-violet-500 hover:bg-violet-600 text-white"
                            onClick={() => handleStatusUpdate('awaiting-validation')} 
                            disabled={updateStatus.isPending}
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Soumettre pour validation client
                          </Button>
                        </div>
                      </div>
                    )}
                    {booking.status === 'awaiting-validation' && (
                      <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-5 h-5 text-violet-500" />
                          <p className="font-medium text-violet-700 dark:text-violet-300">En attente de validation</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Vous avez soumis l'intervention comme terminée. Le client doit confirmer que le travail est satisfaisant.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Client validation step - awaiting-validation */}
              {isClient && booking.status === 'awaiting-validation' && !isCancelled && (
                <div className="bg-card rounded-2xl border-2 border-violet-500/30 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Validation requise</h3>
                      <p className="text-sm text-muted-foreground">Le prestataire a marqué l'intervention comme terminée</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    Vérifiez que le travail a été effectué correctement. Si vous êtes satisfait, confirmez la fin de l'intervention. 
                    Sinon, le prestataire reprendra le travail.
                  </p>

                  {!showRejectForm ? (
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
                        onClick={handleClientValidate}
                        disabled={updateStatus.isPending}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Confirmer - Travail satisfaisant
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
                        onClick={() => setShowRejectForm(true)}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Non satisfait - À reprendre
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-medium text-destructive">Pourquoi le travail n'est pas satisfaisant ?</h4>
                      <Textarea
                        placeholder="Décrivez ce qui doit être corrigé ou refait..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-3">
                        <Button 
                          variant="destructive" 
                          onClick={handleClientReject} 
                          disabled={updateStatus.isPending}
                        >
                          Renvoyer en intervention
                        </Button>
                        <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cancel for Client */}
              {isClient && (booking.status === 'pending' || booking.status === 'confirmed') && !isCancelled && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  {!showCancelForm ? (
                    <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setShowCancelForm(true)}>
                      Annuler la réservation
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-destructive">Annuler la réservation</h3>
                      <Textarea
                        placeholder="Raison de l'annulation (optionnel)..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-3">
                        <Button variant="destructive" onClick={handleCancel} disabled={cancelBooking.isPending}>
                          Confirmer l'annulation
                        </Button>
                        <Button variant="outline" onClick={() => setShowCancelForm(false)}>
                          Retour
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Review Form - Only for completed bookings by client */}
              {isClient && booking.status === 'completed' && !reviewSubmitted && (
                <div className="bg-card rounded-2xl border-2 border-amber-500/30 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Laissez votre avis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Votre retour aide les autres utilisateurs et le prestataire à s'améliorer. 
                    Cet avis sera visible sur le profil du prestataire.
                  </p>

                  {/* Star Rating */}
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'w-8 h-8 transition-colors',
                            (reviewHover || reviewRating) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground'
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground self-center ml-2">
                      {reviewRating > 0 && `${reviewRating}/5`}
                    </span>
                  </div>

                  <Textarea
                    placeholder="Décrivez votre expérience avec ce prestataire..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />

                  <Button
                    variant="hero"
                    onClick={handleSubmitReview}
                    disabled={reviewRating === 0 || !reviewComment.trim() || createReview.isPending}
                  >
                    {createReview.isPending ? 'Publication...' : 'Publier mon avis'}
                  </Button>
                </div>
              )}

              {/* Review submitted success */}
              {reviewSubmitted && (
                <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Merci pour votre avis !</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre retour est maintenant visible sur le profil du prestataire.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Helper/Client Card */}
              {(isClient ? helper : client) && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                    {isClient ? 'Prestataire' : 'Client'}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={(isClient ? helper : client)?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(isClient ? helper : client)?.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {(isClient ? helper : client)?.firstName}{' '}
                        {(isClient ? helper : client)?.lastName}
                      </p>
                      {helper?.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{helper.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to="/messages">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Link>
                    </Button>
                    {(isClient ? helper : client)?.phone && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={`tel:${(isClient ? helper : client)?.phone}`}>
                          <Phone className="w-4 h-4 mr-1" />
                          Appeler
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">Paiement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Montant</span>
                    <span className="font-medium">{booking.totalPrice}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'outline'}>
                      {booking.paymentStatus === 'pending' && 'En attente'}
                      {booking.paymentStatus === 'paid' && 'Payé'}
                      {booking.paymentStatus === 'refunded' && 'Remboursé'}
                    </Badge>
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

export default BookingDetail;
