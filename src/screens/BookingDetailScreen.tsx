import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format } from 'date-fns';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';
import {
  getBooking,
  Booking,
  cancelBooking,
  updateBookingStatus
} from '../api/bookings';
import { getPet } from '../api/pets';
import { getProfile, getSitterProfile } from '../api/profiles';
import { createReview, getReviewForBooking } from '../api/reviews';
import { handleApiError } from '../api';

type ParamList = {
  BookingDetail: {
    bookingId: string;
    userType: 'owner' | 'sitter';
  };
};

type BookingDetailScreenRouteProp = RouteProp<ParamList, 'BookingDetail'>;
type BookingDetailScreenNavigationProp = StackNavigationProp<
  any,
  'BookingDetail'
>;

export const BookingDetailScreen: React.FC = () => {
  const route = useRoute<BookingDetailScreenRouteProp>();
  const navigation = useNavigation<BookingDetailScreenNavigationProp>();
  const { bookingId, userType = 'owner' } = route.params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [petName, setPetName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [sitterName, setSitterName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [hasReview, setHasReview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch booking details
      const bookingData = await getBooking(bookingId);
      setBooking(bookingData);

      // Fetch pet details
      const petData = await getPet(bookingData.pet_id);
      setPetName(petData.name);

      // Fetch owner details
      const ownerData = await getProfile(bookingData.owner_id);
      setOwnerName(`${ownerData.first_name} ${ownerData.last_name}`);

      // Fetch sitter details
      const sitterData = await getSitterProfile(bookingData.sitter_id);
      setSitterName(`${sitterData.first_name} ${sitterData.last_name}`);

      // Check if booking has a review
      const reviewData = await getReviewForBooking(bookingId);
      setHasReview(!!reviewData);
    } catch (err) {
      setError(handleApiError(err, 'Failed to load booking details'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              loadBookingData(); // Reload booking data with updated status
            } catch (err) {
              Alert.alert(
                'Error',
                handleApiError(err, 'Failed to cancel booking')
              );
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleUpdateStatus = (
    status: 'accepted' | 'rejected' | 'completed'
  ) => {
    Alert.alert(
      `${status.charAt(0).toUpperCase() + status.slice(1)} Booking`,
      `Are you sure you want to ${status} this booking?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: `Yes, ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          onPress: async () => {
            try {
              await updateBookingStatus(bookingId, status);
              loadBookingData(); // Reload booking data with updated status
            } catch (err) {
              Alert.alert(
                'Error',
                handleApiError(err, `Failed to ${status} booking`)
              );
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleAddReview = () => {
    if (booking) {
      navigation.navigate('AddReview', {
        bookingId: booking.id as string,
        sitterId: booking.sitter_id,
        sitterName
      });
    }
  };

  const handleViewReview = () => {
    if (booking) {
      navigation.navigate('ReviewDetail', {
        bookingId: booking.id as string
      });
    }
  };

  const handleMessage = () => {
    if (booking) {
      const participantId =
        userType === 'owner' ? booking.sitter_id : booking.owner_id;
      const participantName = userType === 'owner' ? sitterName : ownerName;

      navigation.navigate('Chat', {
        bookingId: booking.id,
        participantId,
        participantName
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
        return Colors.success;
      case 'rejected':
      case 'cancelled':
        return Colors.error;
      case 'completed':
        return Colors.primary;
      default:
        return Colors.textMuted;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'walking':
        return 'footsteps';
      case 'boarding':
        return 'home';
      case 'sitting':
        return 'person';
      default:
        return 'paw';
    }
  };

  useEffect(() => {
    loadBookingData();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={loadBookingData}
          variant="primary"
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Booking not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="primary"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.serviceContainer}>
            <Ionicons
              name={getServiceIcon(booking.service_type)}
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.serviceText}>
              {booking.service_type.charAt(0).toUpperCase() +
                booking.service_type.slice(1)}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) }
            ]}
          >
            <Text style={styles.statusText}>
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Pet:</Text>
            <Text style={styles.value}>{petName}</Text>
          </View>

          {userType === 'owner' ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Sitter:</Text>
              <Text style={styles.value}>{sitterName}</Text>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Owner:</Text>
              <Text style={styles.value}>{ownerName}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{formatDate(booking.start_date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{formatDate(booking.end_date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.priceValue}>${booking.price.toFixed(2)}</Text>
          </View>
        </View>

        {booking.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{booking.notes}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Message"
            onPress={handleMessage}
            variant="primary"
            style={styles.messageButton}
          />

          {/* Owner can cancel pending bookings */}
          {userType === 'owner' && booking.status === 'pending' && (
            <Button
              title="Cancel"
              onPress={handleCancelBooking}
              variant="outline"
              style={styles.actionButton}
            />
          )}

          {/* Sitter can accept/reject pending bookings */}
          {userType === 'sitter' && booking.status === 'pending' && (
            <View style={styles.sitterActions}>
              <Button
                title="Accept"
                onPress={() => handleUpdateStatus('accepted')}
                variant="primary"
                style={styles.acceptButton}
              />
              <Button
                title="Decline"
                onPress={() => handleUpdateStatus('rejected')}
                variant="outline"
                style={styles.rejectButton}
              />
            </View>
          )}

          {/* Sitter can mark accepted bookings as completed */}
          {userType === 'sitter' && booking.status === 'accepted' && (
            <Button
              title="Mark as Completed"
              onPress={() => handleUpdateStatus('completed')}
              variant="primary"
              style={styles.completeButton}
            />
          )}

          {/* Owner can leave a review for a completed booking */}
          {userType === 'owner' &&
            booking.status === 'completed' &&
            !hasReview && (
              <Button
                title="Leave a Review"
                onPress={handleAddReview}
                variant="primary"
                style={styles.reviewButton}
              />
            )}

          {/* View review if exists */}
          {booking.status === 'completed' && hasReview && (
            <Button
              title="View Review"
              onPress={handleViewReview}
              variant="secondary"
              style={styles.reviewButton}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  serviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    width: 70,
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500'
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: Colors.text
  },
  priceValue: {
    flex: 1,
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold'
  },
  notes: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22
  },
  buttonContainer: {
    padding: 16
  },
  messageButton: {
    marginBottom: 16
  },
  actionButton: {
    marginBottom: 16
  },
  acceptButton: {
    flex: 1,
    marginRight: 8
  },
  rejectButton: {
    flex: 1,
    marginLeft: 8
  },
  completeButton: {
    marginBottom: 16
  },
  reviewButton: {
    marginBottom: 16
  },
  sitterActions: {
    flexDirection: 'row',
    marginBottom: 16
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    minWidth: 120
  }
});
