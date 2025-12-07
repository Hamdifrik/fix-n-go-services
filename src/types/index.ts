// Types pour l'application FixIt

export type UserRole = 'client' | 'helper' | 'admin';

export type ServiceType = 
  | 'plomberie' 
  | 'electricite' 
  | 'serrurerie' 
  | 'chauffage' 
  | 'climatisation' 
  | 'vitrerie' 
  | 'menuiserie'
  | 'peinture'
  | 'autre';

export type MissionStatus = 
  | 'pending' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'validated' 
  | 'disputed' 
  | 'cancelled';

export type MissionUrgency = 'normal' | 'urgent' | 'emergency';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: Address;
  createdAt: Date;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Helper extends User {
  role: 'helper';
  services: ServiceType[];
  description: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  availability: HelperAvailability;
  documents: Document[];
  balance: number;
  completedMissions: number;
  responseTime: number; // en minutes
}

export interface HelperAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Document {
  id: string;
  type: 'identity' | 'selfie' | 'certificate' | 'insurance';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
}

export interface Mission {
  id: string;
  clientId: string;
  helperId?: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  urgency: MissionUrgency;
  status: MissionStatus;
  address: Address;
  photos: string[];
  estimatedBudget?: number;
  finalPrice?: number;
  preferredDate: Date;
  preferredTimeSlot: TimeSlot;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  validatedAt?: Date;
  workPhotos?: string[];
  clientRating?: Rating;
  helperRating?: Rating;
}

export interface Rating {
  score: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  missionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  createdAt: Date;
  readAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'mission' | 'message' | 'payment' | 'system';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Transaction {
  id: string;
  missionId: string;
  amount: number;
  status: 'pending' | 'held' | 'released' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
  releasedAt?: Date;
}

// Labels pour les services en français
export const SERVICE_LABELS: Record<ServiceType, string> = {
  plomberie: 'Plomberie',
  electricite: 'Électricité',
  serrurerie: 'Serrurerie',
  chauffage: 'Chauffage',
  climatisation: 'Climatisation',
  vitrerie: 'Vitrerie',
  menuiserie: 'Menuiserie',
  peinture: 'Peinture',
  autre: 'Autre',
};

export const URGENCY_LABELS: Record<MissionUrgency, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
  emergency: 'Urgence absolue',
};

export const STATUS_LABELS: Record<MissionStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  in_progress: 'En cours',
  completed: 'Terminée',
  validated: 'Validée',
  disputed: 'En litige',
  cancelled: 'Annulée',
};
