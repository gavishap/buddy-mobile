import apiClient from './client';

export interface Pet {
  id?: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  description?: string;
  special_requirements?: string;
  owner_id?: string;
  image_url?: string;
}

export const getPets = async (): Promise<Pet[]> => {
  try {
    const response = await apiClient.get('/pets');
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const getPet = async (id: string): Promise<Pet> => {
  try {
    const response = await apiClient.get(`/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet ${id}:`, error);
    throw error;
  }
};

export const createPet = async (petData: Pet): Promise<Pet> => {
  try {
    const response = await apiClient.post('/pets', petData);
    return response.data;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
};

export const updatePet = async (
  id: string,
  petData: Partial<Pet>
): Promise<Pet> => {
  try {
    const response = await apiClient.put(`/pets/${id}`, petData);
    return response.data;
  } catch (error) {
    console.error(`Error updating pet ${id}:`, error);
    throw error;
  }
};

export const deletePet = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/pets/${id}`);
  } catch (error) {
    console.error(`Error deleting pet ${id}:`, error);
    throw error;
  }
};

export const uploadPetImage = async (
  id: string,
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
      name: `pet-${id}.${fileType}`,
      type: `image/${fileType}`
    } as any);

    const response = await apiClient.post(`/pets/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.image_url;
  } catch (error) {
    console.error(`Error uploading image for pet ${id}:`, error);
    throw error;
  }
};
