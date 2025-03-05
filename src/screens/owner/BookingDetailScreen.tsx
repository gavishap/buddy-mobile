import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock booking data
const MOCK_BOOKINGS = {
  '101': {
    id: '101',
    service: 'Dog Walking',
    sitterName: 'Sarah Johnson',
    sitterId: '1',
    petName: 'Buddy',
    petId: '1',
    date: '2023-09-10',
    startTime: '14:00',
    duration: 1,
    status: 'Confirmed',
    price: 25,
    specialInstructions: 'Please make sure to lock the back gate when leaving.',
    location: '123 Main St, Anytown, USA'
  },
  '102': {
    id: '102',
    service: 'Pet Sitting',
    sitterName: 'Michael Brown',
    sitterId: '2',
    petName: 'Max',
    petId: '2',
    date: '2023-09-15',
    startTime: '09:00',
    duration: 3,
    status: 'Pending',
    price: 30,
    specialInstructions: 'Food is in the pantry, top shelf.',
    location: '456 Oak Ave, Anytown, USA'
  },
  '103': {
    id: '103',
    service: 'Boarding',
    sitterName: 'Jessica Williams',
    sitterId: '3',
    petName: 'Lucy',
    petId: '3',
    date: '2023-09-20',
    startTime: '18:00',
    duration: 48,
    status: 'Completed',
    price: 45,
    specialInstructions: 'Lucy needs her medication twice a day.',
    location: '789 Pine St, Anytown, USA'
  }
};

interface BookingParams {
  bookingId: string;
}

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // @ts-ignore - Ignoring type check for demo
  const { bookingId } = route.params as BookingParams;

  // Get the booking from our mock data
  const booking = MOCK_BOOKINGS[bookingId];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'pending':
        return styles.statusPending;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const handleCancel = () => {
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
          onPress: () => {
            // In a real app, this would call an API to cancel the booking
            Alert.alert(
              'Booking Cancelled',
              'Your booking has been cancelled.'
            );
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleContactSitter = () => {
    // In a real app, this would navigate to the messaging screen
    navigation.navigate('Messages', {
      screen: 'MessageChat',
      params: {
        recipientId: booking.sitterId,
        recipientName: booking.sitterName
      }
    });
  };

  const handleViewSitterProfile = () => {
    // Navigate to the sitter profile
    navigation.navigate('FindSitters', {
      screen: 'SitterProfile',
      params: { sitterId: booking.sitterId }
    });
  };

  const handleViewApplications = () => {
    // Navigate to applications screen for pending bookings
    navigation.navigate('Applications', { bookingId: booking.id });
  };

  // If the booking doesn't exist in our mock data
  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Sorry, this booking could not be found.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.errorButton}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusSection}>
          <View
            style={[styles.statusBadge, getStatusBadgeStyle(booking.status)]}
          >
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>

          <Text style={styles.serviceTitle}>{booking.service}</Text>
          <Text style={styles.dateText}>{formatDate(booking.date)}</Text>

          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={18} color="#6b7280" />
            <Text style={styles.timeText}>
              {formatTime(booking.startTime)} • {booking.duration}{' '}
              {booking.duration === 1 ? 'hour' : 'hours'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sitter</Text>
          <TouchableOpacity
            style={styles.sitterRow}
            onPress={handleViewSitterProfile}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>
                {booking.sitterName.charAt(0)}
              </Text>
            </View>
            <View style={styles.sitterInfo}>
              <Text style={styles.sitterName}>{booking.sitterName}</Text>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet</Text>
          <TouchableOpacity
            style={styles.petRow}
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'PetProfile',
                params: { petId: booking.petId }
              })
            }
          >
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{booking.petName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#6b7280" />
            <Text style={styles.locationText}>{booking.location}</Text>
          </View>
        </View>

        {booking.specialInstructions ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>
              {booking.specialInstructions}
            </Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{booking.service}</Text>
            <Text style={styles.priceValue}>
              ${booking.price} x {booking.duration}{' '}
              {booking.duration === 1 ? 'hour' : 'hours'}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${booking.price * booking.duration}
            </Text>
          </View>
        </View>

        {/* Action buttons based on booking status */}
        {booking.status === 'Pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewApplicationsButton}
              onPress={handleViewApplications}
            >
              <Text style={styles.viewApplicationsText}>View Applications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'Confirmed' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactSitter}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#4f46e5" />
              <Text style={styles.contactButtonText}>Contact Sitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'Completed' && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              Alert.alert('Review', 'This would navigate to the review screen.')
            }
          >
            <Ionicons name="star-outline" size={18} color="white" />
            <Text style={styles.reviewButtonText}>Leave a Review</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    height: 60,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  content: {
    flex: 1,
    padding: 15
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)'
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)'
  },
  statusCompleted: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8
  },
  dateText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6b7280'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  sitterRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  profileInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sitterInfo: {
    flex: 1
  },
  sitterName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  viewProfileText: {
    fontSize: 14,
    color: '#4f46e5'
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  petInfo: {
    flex: 1
  },
  petName: {
    fontSize: 16,
    fontWeight: '500'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1
  },
  instructionsText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  actionButtons: {
    marginBottom: 30
  },
  viewApplicationsButton: {
    backgroundColor: '#4f46e5',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  viewApplicationsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  contactButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4f46e5'
  },
  contactButtonText: {
    marginLeft: 8,
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600'
  },
  reviewButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  reviewButtonText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center'
  },
  errorButton: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '600'
  }
});

export default BookingDetailScreen;
