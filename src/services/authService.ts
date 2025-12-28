const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// Token management
export const authService = {
  // Store tokens in localStorage
  setTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Store user info
  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store tokens and user info
    this.setTokens(data.tokens);
    this.setUser(data.user);

    return data;
  },

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAccessToken()}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  },

  // Refresh access token
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    
    return data.access;
  },

  // Get user profile
  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // Make authenticated request
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'include',
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      try {
        const newToken = await this.refreshToken();
        // Retry request with new token
        return fetch(url, {
          ...options,
          mode: 'cors',
          credentials: 'include',
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } catch (error) {
        this.clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    return response;
  },
};
