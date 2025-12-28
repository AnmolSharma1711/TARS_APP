import { Preferences } from '@capacitor/preferences';

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
  // Store tokens using Capacitor Preferences for persistent storage
  async setTokens(tokens: AuthTokens) {
    await Preferences.set({ key: 'access_token', value: tokens.access });
    await Preferences.set({ key: 'refresh_token', value: tokens.refresh });
  },

  async getAccessToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'access_token' });
    return value;
  },

  async getRefreshToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'refresh_token' });
    return value;
  },

  async clearTokens() {
    await Preferences.remove({ key: 'access_token' });
    await Preferences.remove({ key: 'refresh_token' });
    await Preferences.remove({ key: 'user' });
  },

  // Store user info
  async setUser(user: User) {
    await Preferences.set({ key: 'user', value: JSON.stringify(user) });
  },

  async getUser(): Promise<User | null> {
    const { value } = await Preferences.get({ key: 'user' });
    return value ? JSON.parse(value) : null;
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
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
    await this.setTokens(data.tokens);
    await this.setUser(data.user);

    return data;
  },

  // Logout
  async logout(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    
    if (refreshToken) {
      try {
        const accessToken = await this.getAccessToken();
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    await this.clearTokens();
  },

  // Refresh access token
  async refreshToken(): Promise<string> {
    const refreshToken = await this.getRefreshToken();
    
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
      await this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    await Preferences.set({ key: 'access_token', value: data.access });
    
    return data.access;
  },

  // Get user profile
  async getProfile(): Promise<User> {
    const token = await this.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // Make authenticated request
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAccessToken();
    
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
        await this.clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    return response;
  },
};
