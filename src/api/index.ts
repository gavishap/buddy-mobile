// Export all API services for easy importing

// Base API client
export { default as apiClient } from './client';

// Auth services
export * from './auth';

// User profile services
export * from './profiles';

// Pet services
export * from './pets';

// Booking services
export * from './bookings';

// Messaging services
export * from './messages';

// Review services
export * from './reviews';

// Availability services
export * from './availability';

// Utility function to handle API errors
export const handleApiError = (
  error: any,
  fallbackMessage = 'An error occurred'
): string => {
  console.error('API Error:', error);

  // If the error has a response with data.message
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }

  // If the error has a message property
  if (error.message) {
    // Handle network errors
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection.';
    }
    return error.message;
  }

  // Return fallback message
  return fallbackMessage;
};
