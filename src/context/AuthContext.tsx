import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// API URL - must match the one in api/client.ts
const API_URL = Platform.select({
  // For Android emulator, localhost is 10.0.2.2
  android: 'http://10.0.2.2:8000/api/v1',
  // For iOS simulator, localhost is localhost
  ios: 'http://localhost:8000/api/v1',
  // Fallback for web or any other platform
  default: 'http://localhost:8000/api/v1'
});

console.log('Using API URL:', API_URL);

// Log all axios requests and responses for debugging
axios.interceptors.request.use(request => {
  console.log('AXIOS REQUEST:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('AXIOS RESPONSE:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    console.log('AXIOS ERROR:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  user_type: 'owner' | 'sitter';
  created_at: string;
  avatar_url: string | null;
};

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          setToken(storedToken);
          // Configure axios to use the token
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${storedToken}`;
          // Fetch user data
          await fetchUserData();
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const fetchUserData = async () => {
    try {
      console.log('📝 Fetching user data...');

      // Following the same pattern with duplicated 'auth'
      const endpoint = '/auth/auth/me';
      const fullUrl = `${API_URL}${endpoint}`;

      console.log(`📝 Using user data endpoint: ${fullUrl}`);

      const response = await axios.get(fullUrl);
      const userData = response.data;

      console.log('📝 User data retrieved:', userData);

      setUser({
        id: userData.id,
        email: userData.email
      });

      console.log(
        `📝 Attempting to fetch profile data for user ID: ${userData.id}`
      );

      // Try to fetch profile data - this might also need the duplicate 'auth' pattern
      try {
        const profileEndpoint = `/auth/auth/profiles/${userData.id}`;
        const profileUrl = `${API_URL}${profileEndpoint}`;

        console.log(`📝 Using profile endpoint: ${profileUrl}`);

        const { data: profileData } = await axios.get(profileUrl);
        console.log('📝 Profile data retrieved:', profileData);
        setProfile(profileData);
      } catch (profileError: any) {
        console.error('📝 Error fetching profile data:', profileError.message);
        console.log('📝 Will continue without profile data');
        // Don't throw error here - we can proceed without profile data
      }
    } catch (error) {
      console.error('📝 Error fetching user data:', error);
      console.log('📝 Will now sign out due to authentication failure');
      // If error, clear token and user data
      await signOut();
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => {
    try {
      console.log('📝 Starting registration process...');
      console.log('📝 User data:', userData);

      // Use the correct endpoint based on the user_type
      // The backend logs show that /api/v1/auth/auth/register/owner works (note the double 'auth')
      const userType = userData.user_type || 'owner';
      const endpoint = `/auth/auth/register/${userType}`;
      const fullUrl = `${API_URL}${endpoint}`;

      console.log(`📝 Using registration endpoint: ${fullUrl}`);

      // Prepare the payload based on the data we saw in the logs
      const payload = {
        email,
        password,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        bio: userData.bio || ''
      };

      console.log('📝 Sending payload:', payload);

      const { data } = await axios.post(fullUrl, payload);
      console.log('📝 Registration successful, response:', data);

      // If we get a token in response
      if (data.access_token) {
        console.log('📝 Token received, storing token');
        // Store token
        await SecureStore.setItemAsync('authToken', data.access_token);
        setToken(data.access_token);

        // Configure axios
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.access_token}`;

        // Set user data
        setUser({
          id: data.id,
          email: email
        });

        return { error: null };
      }

      // If we don't get a token but the request was successful
      console.log('📝 No token in response, attempting login');
      // The endpoint returns user data instead of token, so we need to sign in
      return await signIn(email, password);
    } catch (error: any) {
      console.error('📝 Signup error:', error);
      console.log('📝 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      return {
        error: {
          message:
            error.response?.data?.detail ||
            'Failed to create account. Please try again.'
        }
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting login with:', email);

      // Based on the registration pattern, the login endpoint might also have the duplicated 'auth'
      const endpoint = '/auth/auth/login';
      const fullUrl = `${API_URL}${endpoint}`;

      console.log(`📝 Using login endpoint: ${fullUrl}`);

      // FastAPI OAuth2 endpoint expects x-www-form-urlencoded content
      const params = new URLSearchParams();
      params.append('username', email); // OAuth2 uses 'username' for login identifier
      params.append('password', password);

      console.log('📝 Login with params:', {
        username: email,
        password: '******'
      });

      const { data } = await axios.post(fullUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log('📝 Login successful, response:', data);

      // Store token
      console.log('📝 Storing authentication token');
      await SecureStore.setItemAsync('authToken', data.access_token);
      setToken(data.access_token);

      // Configure axios
      console.log('📝 Setting authorization header');
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.access_token}`;

      // Fetch user data to get the user ID
      console.log('📝 Fetching user data');
      await fetchUserData();

      return { error: null };
    } catch (error: any) {
      console.error('📝 Login error:', error);
      console.log('📝 Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      return {
        error: {
          message:
            error.response?.data?.detail ||
            'Failed to sign in. Please check your credentials.'
        }
      };
    }
  };

  const signOut = async () => {
    try {
      // Clear token
      await SecureStore.deleteItemAsync('authToken');
      setToken(null);

      // Clear user data
      setUser(null);
      setProfile(null);

      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) return { error: { message: 'Not authenticated' } };

      const { data } = await axios.patch(
        `${API_URL}/profiles/${user.id}`,
        updates
      );

      // Update local profile data
      setProfile(prev => (prev ? { ...prev, ...data } : null));

      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return {
        error: error.response?.data || {
          message: 'An error occurred while updating profile'
        }
      };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
