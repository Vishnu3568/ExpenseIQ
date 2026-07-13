export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

export interface ValidationFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationFieldError[];
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, currency?: string) => Promise<void>;
  logout: () => Promise<void>;
}
