import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'owner' | 'sitter';
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: any; // Replace with more specific user type from your schema
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    // Save token to secure storage
    await SecureStore.setItemAsync('auth_token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      userData
    );
    // Save token to secure storage if registration automatically logs in
    if (response.data.access_token) {
      await SecureStore.setItemAsync('auth_token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Remove token from secure storage
    await SecureStore.deleteItemAsync('auth_token');
    // Optionally, inform the backend about logout
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the token even if the API call fails
    await SecureStore.deleteItemAsync('auth_token');
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
