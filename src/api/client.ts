import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL for the API
// On Android emulator, localhost is 10.0.2.2
// On iOS simulator, localhost is localhost
// On physical devices, use your computer's IP address
const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  ios: 'http://localhost:8000/api/v1',
  default: 'http://localhost:8000/api/v1' // fallback for web or any other platform
});

// Create an axios instance with predefined configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // If we have logic for refreshing tokens, we would put it here
      // For now, we'll just consider the user logged out
      await SecureStore.deleteItemAsync('auth_token');
      // We could also trigger navigation to login screen or dispatch a logout event
    }

    return Promise.reject(error);
  }
);

export default apiClient;
