import apiClient from './client';

export interface Booking {
  id?: string;
  owner_id: string;
  sitter_id: string;
  pet_id: string;
  service_type: 'walking' | 'boarding' | 'sitting';
  start_date: string;
  end_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  price: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const getBookings = async (status?: string): Promise<Booking[]> => {
  try {
    const params = status ? { status } : undefined;
    const response = await apiClient.get('/bookings', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBooking = async (id: string): Promise<Booking> => {
  try {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (
  bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<Booking> => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  id: string,
  status: Booking['status']
): Promise<Booking> => {
  try {
    const response = await apiClient.patch(`/bookings/${id}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id} status:`, error);
    throw error;
  }
};

export const cancelBooking = async (id: string): Promise<Booking> => {
  return updateBookingStatus(id, 'cancelled');
};

export const getSitterBookings = async (
  sitterId: string,
  status?: string
): Promise<Booking[]> => {
  try {
    const params: any = { sitter_id: sitterId };
    if (status) {
      params.status = status;
    }
    const response = await apiClient.get('/bookings', { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for sitter ${sitterId}:`, error);
    throw error;
  }
};

export const getOwnerBookings = async (
  ownerId: string,
  status?: string
): Promise<Booking[]> => {
  try {
    const params: any = { owner_id: ownerId };
    if (status) {
      params.status = status;
    }
    const response = await apiClient.get('/bookings', { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for owner ${ownerId}:`, error);
    throw error;
  }
};
