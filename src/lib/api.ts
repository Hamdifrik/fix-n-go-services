// API Configuration & Service
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'helper';
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  expertise?: string[];
  hourlyRate?: number;
  experience?: string;
  availability?: boolean;
  rating?: number;
  totalReviews?: number;
  bio?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  helper: User | string;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  client: User | string;
  helper: User | string;
  service: Service | string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  booking: string;
  client: User | string;
  helper: string;
  rating: number;
  comment: string;
  response?: string;
  responseDate?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'booking' | 'review' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { msg: string; param?: string }[];
  totalPages?: number;
  currentPage?: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API fetch function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================
export const authApi = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'client' | 'helper';
    expertise?: string[];
    hourlyRate?: number;
  }) => {
    return apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{ user: User; token: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return apiRequest<User>('/auth/profile');
  },

  updateProfile: async (profileData: Partial<User>) => {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },
};

// ============================================
// SERVICES API
// ============================================
export const servicesApi = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest<Service[]>(`/services${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Service>(`/services/${id}`);
  },

  create: async (serviceData: {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    images?: string[];
    tags?: string[];
  }) => {
    return apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  update: async (id: string, serviceData: Partial<Service>) => {
    return apiRequest<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE',
    });
  },

  getMyServices: async () => {
    return apiRequest<Service[]>('/services/helper/my-services');
  },
};

// ============================================
// BOOKINGS API
// ============================================
export const bookingsApi = {
  create: async (bookingData: {
    serviceId: string;
    scheduledDate: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
    notes?: string;
  }) => {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest<Booking[]>(`/bookings${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<Booking>(`/bookings/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest<Booking>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string, reason?: string) => {
    return apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// ============================================
// REVIEWS API
// ============================================
export const reviewsApi = {
  create: async (reviewData: { bookingId: string; rating: number; comment: string }) => {
    return apiRequest<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getHelperReviews: async (helperId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest<Review[]>(`/reviews/helper/${helperId}${query ? `?${query}` : ''}`);
  },

  respond: async (reviewId: string, response: string) => {
    return apiRequest<Review>(`/reviews/${reviewId}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response }),
    });
  },
};

// ============================================
// USERS API
// ============================================
export const usersApi = {
  getHelpers: async (params?: {
    expertise?: string;
    minRating?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.expertise) searchParams.append('expertise', params.expertise);
    if (params?.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest<User[]>(`/users/helpers${query ? `?${query}` : ''}`);
  },

  getHelperById: async (id: string) => {
    return apiRequest<User & { services: Service[] }>(`/users/helpers/${id}`);
  },

  getStats: async () => {
    return apiRequest<{
      totalBookings: number;
      completedBookings: number;
      pendingBookings: number;
      activeServices?: number;
      totalEarnings?: number;
    }>('/users/stats');
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================
export const notificationsApi = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest<{ notifications: Notification[]; unreadCount: number }>(
      `/notifications${query ? `?${query}` : ''}`
    );
  },

  markAsRead: async (id: string) => {
    return apiRequest<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthCheck = async () => {
  return apiRequest<{ status: string; message: string }>('/health');
};
