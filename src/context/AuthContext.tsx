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
  user_type?: 'owner' | 'sitter';
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

      // Try different user endpoints to find the correct one
      const userEndpoints = [
        '/auth/me', // Standard path
        '/users/me', // API v1 uses this path
        '/auth/auth/me', // Double auth path that was found in logs
        '/me' // Root path
      ];

      let userData = null;
      let error = null;

      // Try each endpoint until one works
      for (const endpoint of userEndpoints) {
        const fullUrl = `${API_URL}${endpoint}`;
        console.log(`📝 Trying user data endpoint: ${fullUrl}`);

        try {
          const response = await axios.get(fullUrl);
          userData = response.data;
          console.log(
            `📝 User data fetch succeeded with endpoint: ${endpoint}`
          );
          break; // Exit the loop if successful
        } catch (err: any) {
          console.log(
            `📝 User data fetch failed with endpoint: ${endpoint}`,
            err.message
          );
          error = err;
        }
      }

      if (!userData) {
        console.log('📝 All user data fetch attempts failed');
        throw error || new Error('User data fetch failed with all endpoints');
      }

      console.log('📝 User data retrieved:', userData);

      // Special logging for gavishap@gmail.com
      if (userData.email === 'gavishap@gmail.com') {
        console.log('📝 SPECIAL LOG FOR GAVISHAP USER:');
        console.log('📝 User ID:', userData.id);
        console.log('📝 User Type:', userData.user_type);
        console.log('📝 Full user data:', JSON.stringify(userData));
      }

      setUser({
        id: userData.id,
        email: userData.email,
        user_type: userData.user_type
      });

      console.log(
        `📝 Attempting to fetch profile data for user ID: ${userData.id}`
      );

      // Try different profile endpoints to find the correct one
      const profileEndpoints = [
        `/profiles/${userData.id}`,
        `/auth/profiles/${userData.id}`,
        `/auth/auth/profiles/${userData.id}`
      ];

      let profileData = null;
      let profileError = null;

      // Try each endpoint until one works
      for (const endpoint of profileEndpoints) {
        const fullUrl = `${API_URL}${endpoint}`;
        console.log(`📝 Trying profile endpoint: ${fullUrl}`);

        try {
          const response = await axios.get(fullUrl);
          profileData = response.data;
          console.log(
            `📝 Profile data fetch succeeded with endpoint: ${endpoint}`
          );
          break; // Exit the loop if successful
        } catch (err: any) {
          console.log(
            `📝 Profile data fetch failed with endpoint: ${endpoint}`,
            err.message
          );
          profileError = err;
        }
      }

      if (profileData) {
        console.log('📝 Profile data retrieved:', profileData);

        // Special logging for gavishap@gmail.com
        if (userData.email === 'gavishap@gmail.com') {
          console.log('📝 SPECIAL LOG FOR GAVISHAP USER PROFILE:');
          console.log('📝 Profile user_type:', profileData.user_type);
          console.log('📝 Full profile data:', JSON.stringify(profileData));
        }

        // If profile doesn't have user_type but user does, add it to profile
        if (!profileData.user_type && userData.user_type) {
          profileData.user_type = userData.user_type;
          console.log(
            '📝 Added user_type to profile from user data:',
            userData.user_type
          );
        }

        setProfile(profileData);
      } else {
        console.log(
          '📝 All profile data fetch attempts failed. Will continue without profile data.'
        );
      }
    } catch (error) {
      console.error('📝 Error fetching user data:', error);
      console.log('📝 Will now sign out due to authentication failure');
      // If error, clear token and user data
      await signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting login with:', email);

      // Try different login endpoints
      const loginEndpoints = [
        '/auth/login', // Standard path
        '/auth/auth/login', // Double auth path that was found in logs
        '/login', // Root path
        '/token' // OAuth2 standard
      ];

      let response = null;
      let error = null;

      // Try each endpoint until one works
      for (const endpoint of loginEndpoints) {
        const fullUrl = `${API_URL}${endpoint}`;
        console.log(`📝 Trying login endpoint: ${fullUrl}`);

        try {
          // FastAPI OAuth2 endpoint expects x-www-form-urlencoded content
          const params = new URLSearchParams();
          params.append('username', email); // OAuth2 uses 'username' for login identifier
          params.append('password', password);

          console.log('📝 Login with params:', {
            username: email,
            password: '******'
          });

          response = await axios.post(fullUrl, params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          console.log(`📝 Login succeeded with endpoint: ${endpoint}`);
          break; // Exit the loop if successful
        } catch (err: any) {
          console.log(
            `📝 Login failed with endpoint: ${endpoint}`,
            err.message
          );
          error = err;
        }
      }

      if (!response) {
        console.log('📝 All login attempts failed');
        throw error || new Error('Login failed with all endpoints');
      }

      const { data } = response;
      console.log('📝 Login successful, response:', data);

      // Store token
      console.log('📝 Storing authentication token');
      // The token field could be access_token or token depending on the API
      const tokenValue = data.access_token || data.token;
      await SecureStore.setItemAsync('authToken', tokenValue);
      setToken(tokenValue);

      // Configure axios
      console.log('📝 Setting authorization header');
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;

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

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => {
    try {
      console.log('📝 Starting registration process...');
      console.log('📝 User data:', userData);

      const userType = userData.user_type || 'owner';

      // Try the type-specific endpoint first
      const registerEndpoints = [
        `/auth/register/${userType}`, // Type-specific endpoint (preferred)
        `/auth/auth/register/${userType}`,
        '/auth/register', // Generic endpoint
        '/users',
        '/register'
      ];

      let response = null;
      let error = null;

      // Prepare the payload based on the data we saw in the logs
      const payload = {
        email,
        password,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        user_type: userType
      };

      console.log('📝 Sending payload:', payload);

      // Try each endpoint until one works
      for (const endpoint of registerEndpoints) {
        const fullUrl = `${API_URL}${endpoint}`;
        console.log(`📝 Trying registration endpoint: ${fullUrl}`);

        try {
          response = await axios.post(fullUrl, payload);
          console.log(`📝 Registration succeeded with endpoint: ${endpoint}`);
          break; // Exit the loop if successful
        } catch (err: any) {
          console.log(
            `📝 Registration failed with endpoint: ${endpoint}`,
            err.message
          );
          error = err;
        }
      }

      if (!response) {
        console.log('📝 All registration attempts failed');
        throw error || new Error('Registration failed with all endpoints');
      }

      const { data } = response;
      console.log('📝 Registration successful, response:', data);

      // If we get a token in response
      if (data.access_token || data.token) {
        console.log('📝 Token received, storing token');
        // Store token
        const tokenValue = data.access_token || data.token;
        await SecureStore.setItemAsync('authToken', tokenValue);
        setToken(tokenValue);

        // Configure axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;

        // Extract user ID from token payload if available
        let userId = '';
        try {
          // Token is in format: header.payload.signature
          const tokenParts = tokenValue.split('.');
          if (tokenParts.length >= 2) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userId = payload.sub || '';
            console.log('📝 Extracted user ID from token:', userId);
          }
        } catch (e) {
          console.log('📝 Could not extract user ID from token');
        }

        // Set user data with the ID from token, or fallback to any available ID
        setUser({
          id: data.id || data.user_id || userId || email.split('@')[0], // Use email prefix as last resort
          email: email,
          user_type: data.user_type || userType // Ensure user_type is set
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
