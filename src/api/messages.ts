import apiClient from './client';

export interface Message {
  id?: string;
  sender_id: string;
  receiver_id: string;
  booking_id?: string;
  content: string;
  is_read: boolean;
  created_at?: string;
}

export interface Conversation {
  participant_id: string;
  participant_name: string;
  last_message: string;
  unread_count: number;
  last_updated: string;
}

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const getMessages = async (userId: string): Promise<Message[]> => {
  try {
    const response = await apiClient.get(`/messages/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages with user ${userId}:`, error);
    throw error;
  }
};

export const getBookingMessages = async (
  bookingId: string
): Promise<Message[]> => {
  try {
    const response = await apiClient.get(`/messages/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for booking ${bookingId}:`, error);
    throw error;
  }
};

export const sendMessage = async (
  messageData: Omit<Message, 'id' | 'is_read' | 'created_at'>
): Promise<Message> => {
  try {
    const response = await apiClient.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markAsRead = async (messageId: string): Promise<void> => {
  try {
    await apiClient.patch(`/messages/${messageId}/read`);
  } catch (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    throw error;
  }
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    await apiClient.patch(`/messages/user/${userId}/read`);
  } catch (error) {
    console.error(
      `Error marking all messages with user ${userId} as read:`,
      error
    );
    throw error;
  }
};
