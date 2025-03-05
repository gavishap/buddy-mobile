import apiClient from './client';

export interface Review {
  id?: string;
  booking_id: string;
  owner_id: string;
  sitter_id: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export const getSitterReviews = async (sitterId: string): Promise<Review[]> => {
  try {
    const response = await apiClient.get(`/reviews/sitter/${sitterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for sitter ${sitterId}:`, error);
    throw error;
  }
};

export const getReviewForBooking = async (
  bookingId: string
): Promise<Review | null> => {
  try {
    const response = await apiClient.get(`/reviews/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Error fetching review for booking ${bookingId}:`, error);
    throw error;
  }
};

export const createReview = async (
  reviewData: Omit<Review, 'id' | 'created_at'>
): Promise<Review> => {
  try {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (
  reviewId: string,
  reviewData: Pick<Review, 'rating' | 'comment'>
): Promise<Review> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await apiClient.delete(`/reviews/${reviewId}`);
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
};
