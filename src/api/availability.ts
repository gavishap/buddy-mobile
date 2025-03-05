import apiClient from './client';

export interface Availability {
  id?: string;
  sitter_id: string;
  day_of_week:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
}

export interface DateAvailability {
  date: string; // YYYY-MM-DD format
  is_available: boolean;
  start_time?: string; // HH:MM format
  end_time?: string; // HH:MM format
}

export const getSitterWeeklyAvailability = async (
  sitterId: string
): Promise<Availability[]> => {
  try {
    const response = await apiClient.get(`/availability/${sitterId}/weekly`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching weekly availability for sitter ${sitterId}:`,
      error
    );
    throw error;
  }
};

export const getSitterDateAvailability = async (
  sitterId: string,
  startDate: string,
  endDate: string
): Promise<DateAvailability[]> => {
  try {
    const response = await apiClient.get(`/availability/${sitterId}/dates`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching date availability for sitter ${sitterId}:`,
      error
    );
    throw error;
  }
};

export const updateWeeklyAvailability = async (
  sitterId: string,
  availabilityData: Omit<Availability, 'id' | 'sitter_id'>[]
): Promise<Availability[]> => {
  try {
    const response = await apiClient.put(
      `/availability/${sitterId}/weekly`,
      availabilityData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating weekly availability for sitter ${sitterId}:`,
      error
    );
    throw error;
  }
};

export const setDateAvailability = async (
  sitterId: string,
  dateAvailability: Omit<DateAvailability, 'id'>
): Promise<DateAvailability> => {
  try {
    const response = await apiClient.post(
      `/availability/${sitterId}/dates`,
      dateAvailability
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error setting date availability for sitter ${sitterId}:`,
      error
    );
    throw error;
  }
};

export const checkAvailability = async (
  sitterId: string,
  date: string,
  startTime?: string,
  endTime?: string
): Promise<{ is_available: boolean }> => {
  try {
    const response = await apiClient.get(`/availability/${sitterId}/check`, {
      params: {
        date,
        start_time: startTime,
        end_time: endTime
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error checking availability for sitter ${sitterId}:`, error);
    throw error;
  }
};
