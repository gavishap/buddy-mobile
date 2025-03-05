import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const MOCK_BOOKING = {
  id: '1',
  ownerName: 'John Smith',
  ownerPhone: '555-123-4567',
  ownerEmail: 'john.smith@example.com',
  petName: 'Max',
  petType: 'Dog',
  petBreed: 'Golden Retriever',
  service: 'Dog Walking',
  date: '2023-05-15',
  time: '14:00 - 16:00',
  duration: '2 hours',
  location: '123 Main St, Anytown, CA 12345',
  specialInstructions:
    'Max loves to play fetch at the park. Please make sure he gets at least 30 minutes of fetch time.',
  status: 'confirmed',
  payment: '$40.00'
};

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // In a real app, you would fetch the booking data based on the ID
  // const { bookingId } = route.params;
  const booking = MOCK_BOOKING;

  const handleStartService = () => {
    Alert.alert('Start Service', 'Are you ready to start this service?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Start',
        onPress: () => {
          // Logic to start service
          Alert.alert(
            'Service Started',
            'You have successfully started the service.'
          );
        }
      }
    ]);
  };

  const handleCompleteService = () => {
    Alert.alert('Complete Service', 'Have you completed this service?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Complete',
        onPress: () => {
          // Logic to complete service
          Alert.alert(
            'Service Completed',
            'Thank you for completing the service.'
          );
        }
      }
    ]);
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Logic to cancel booking
            Alert.alert(
              'Booking Cancelled',
              'The booking has been cancelled successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleMessageOwner = () => {
    // Navigate to messaging screen
    Alert.alert('Message Owner', 'This will navigate to the messaging screen');
  };

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
        <View style={styles.rightHeader} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View
            style={[
              styles.statusBadge,
              booking.status === 'confirmed'
                ? styles.confirmedBadge
                : styles.pendingBadge
            ]}
          >
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service Type:</Text>
              <Text style={styles.infoValue}>{booking.service}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{booking.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{booking.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{booking.duration}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment:</Text>
              <Text style={styles.infoValue}>{booking.payment}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.address}>{booking.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{booking.ownerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{booking.ownerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{booking.ownerEmail}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{booking.petName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{booking.petType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Breed:</Text>
              <Text style={styles.infoValue}>{booking.petBreed}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.instructions}>
              {booking.specialInstructions}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessageOwner}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#4f46e5" />
            <Text style={styles.messageButtonText}>Message Owner</Text>
          </TouchableOpacity>

          {booking.status === 'confirmed' && (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleStartService}
              >
                <Text style={styles.primaryButtonText}>Start Service</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCompleteService}
              >
                <Text style={styles.primaryButtonText}>Complete Service</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelBooking}
              >
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  backButton: {
    padding: 5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  rightHeader: {
    width: 24
  },
  content: {
    flex: 1,
    padding: 20
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  confirmedBadge: {
    backgroundColor: '#d1fae5'
  },
  pendingBadge: {
    backgroundColor: '#fef3c7'
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666'
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  address: {
    fontSize: 14,
    color: '#333'
  },
  instructions: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 30
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold'
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  messageButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
});

export default BookingDetailScreen;
