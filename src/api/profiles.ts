import apiClient from './client';

export interface Profile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  bio?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar_url?: string;
  user_type: 'owner' | 'sitter';
}

export interface SitterProfile extends Profile {
  services: ('walking' | 'boarding' | 'sitting')[];
  hourly_rate?: number;
  daily_rate?: number;
  experience_years?: number;
  is_available: boolean;
}

export const getProfile = async (userId: string): Promise<Profile> => {
  try {
    const response = await apiClient.get(`/profiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw error;
  }
};

export const updateProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<Profile> => {
  try {
    const response = await apiClient.put(`/profiles/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
};

export const getSitterProfiles = async (filters?: {
  service_type?: string;
  location?: string;
  available_only?: boolean;
}): Promise<SitterProfile[]> => {
  try {
    const response = await apiClient.get('/profiles/sitters', {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sitter profiles:', error);
    throw error;
  }
};

export const getSitterProfile = async (
  sitterId: string
): Promise<SitterProfile> => {
  try {
    const response = await apiClient.get(`/profiles/sitters/${sitterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sitter profile for user ${sitterId}:`, error);
    throw error;
  }
};

export const updateSitterProfile = async (
  sitterId: string,
  profileData: Partial<SitterProfile>
): Promise<SitterProfile> => {
  try {
    const response = await apiClient.put(
      `/profiles/sitters/${sitterId}`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating sitter profile for user ${sitterId}:`, error);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  imageUri: string
): Promise<string> => {
  try {
    const formData = new FormData();

    // Extract file name and type from uri
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    // Create a file object
    formData.append('file', {
      uri: imageUri,
      name: `profile-${userId}.${fileType}`,
      type: `image/${fileType}`
    } as any);

    const response = await apiClient.post(
      `/profiles/${userId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.avatar_url;
  } catch (error) {
    console.error(`Error uploading image for profile ${userId}:`, error);
    throw error;
  }
};
