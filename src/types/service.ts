// Types pour le modèle "Services" (Marketplace)

export type ServiceCategory = 
  | 'plomberie' 
  | 'electricite' 
  | 'serrurerie' 
  | 'chauffage' 
  | 'climatisation' 
  | 'vitrerie' 
  | 'menuiserie'
  | 'peinture'
  | 'menage'
  | 'jardinage'
  | 'mecanique'
  | 'autre';

export type PricingType = 'hourly' | 'fixed';
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

// Service publié par un Helper
export interface Service {
  id: string;
  helperId: string;
  helper: HelperInfo;
  title: string;
  description: string;
  category: ServiceCategory;
  pricingType: PricingType;
  price: number; // Prix en euros
  duration: number; // Durée estimée en minutes
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Informations du Helper (pour affichage dans les cards)
export interface HelperInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  responseTime: number; // en minutes
  completedJobs: number;
  isVerified: boolean;
  location: string;
}

// Réservation d'un service par un client
export interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  clientId: string;
  helperId: string;
  status: BookingStatus;
  scheduledDate: Date;
  scheduledTime: string;
  address: BookingAddress;
  notes?: string;
  totalPrice: number;
  paymentStatus: 'pending' | 'held' | 'released' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
}

export interface BookingAddress {
  street: string;
  city: string;
  postalCode: string;
  additionalInfo?: string;
  lat?: number;
  lng?: number;
}

// Avis sur un service
export interface Review {
  id: string;
  serviceId: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  photos?: string[];
  helperResponse?: string;
  createdAt: Date;
}

// Filtres pour la recherche de services
export interface ServiceFilters {
  query?: string;
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxDistance?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
}

// Labels en français
export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  serrurerie: 'Serrurerie',
  chauffage: 'Chauffage',
  climatisation: 'Climatisation',
  vitrerie: 'Vitrerie',
  menuiserie: 'Menuiserie',
  peinture: 'Peinture',
  menage: 'Ménage',
  jardinage: 'Jardinage',
  mecanique: 'Mécanique',
  autre: 'Autre',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'En attente',
  accepted: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
  disputed: 'En litige',
};

export const PRICING_TYPE_LABELS: Record<PricingType, string> = {
  hourly: '/heure',
  fixed: 'forfait',
};
