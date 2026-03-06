import apiClient from './client';

export interface UserPreferences {
  notifications: boolean;
  emailDigest: boolean;
  theme: 'light' | 'dark' | 'corporate';
  language: string;
}

export interface UserGamification {
  points: number;
  badges: string[];
  level: number;
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  employeeId: string;
  companyId: string | { _id: string; name: string; code: string; logo?: string };
  departmentId: string | { _id: string; name: string; code: string };
  designation: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
  isActive: boolean;
  preferences: UserPreferences;
  gamification: UserGamification;
  lastLogin?: string;
  joinDate: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

const TOKEN_KEY = 'auth_token';

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    const { token } = response.data.data;
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
    return response.data;
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    companyId: string;
    departmentId: string;
    designation: string;
    role?: string;
  }) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return response.data.data.user;
  },

  async updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'displayName' | 'avatar' | 'preferences'>>) {
    const response = await apiClient.put<{ success: boolean; data: { user: User } }>('/auth/profile', data);
    return response.data.data.user;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem(TOKEN_KEY);
    return null;
  },
};

export default authApi;
