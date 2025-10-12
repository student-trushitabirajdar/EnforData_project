// API configuration and HTTP client
const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  firm_name: string;
  role: string;
  whatsapp_number: string;
  alternative_number?: string;
  foreign_number?: string;
  address: string;
  location: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firm_name: string;
    city: string;
    state: string;
    is_verified: boolean;
    created_at: string;
  };
}

export interface CreatePropertyRequest {
  title: string;
  type: 'apartment' | 'house' | 'commercial' | 'plot';
  listing_type: 'sale' | 'rent';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  address: string;
  city: string;
  state: string;
  description: string;
  amenities: string[];
}

export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'commercial' | 'plot';
  listing_type: 'sale' | 'rent';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  address: string;
  city: string;
  state: string;
  description: string;
  amenities: string[];
  status: 'available' | 'sold' | 'rented' | 'under_negotiation';
  broker_id: string;
  broker_name?: string;
  broker_city?: string;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('enfor_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<ApiResponse<AuthResponse['user']>> {
    return this.request<AuthResponse['user']>('/auth/me');
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // File upload
  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ profile_image: string }>> {
    const formData = new FormData();
    formData.append('profile_photo', file);

    return this.request<{ profile_image: string }>('/upload/profile-photo', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  // Property endpoints
  async getProperties(): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>('/properties');
  }

  async createProperty(propertyData: CreatePropertyRequest): Promise<ApiResponse<Property>> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);