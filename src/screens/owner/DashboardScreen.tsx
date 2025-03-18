import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// API URL
const API_URL = Platform.select({
  // For Android emulator, localhost is 10.0.2.2
  android: 'http://10.0.2.2:8000/api/v1',
  // For iOS simulator, localhost is localhost
  ios: 'http://localhost:8000/api/v1',
  // Fallback for web or any other platform
  default: 'http://localhost:8000/api/v1'
});

type Booking = {
  id: string;
  date: string;
  duration: number;
  status: string;
  service_type: string;
  pet_id: string;
  sitter_id: string | null;
  pet_name?: string;
  sitter_name?: string;
};

type OwnerStackParamList = {
  OwnerDashboard: undefined;
  BookingDetail: { bookingId: string };
  Applications: { bookingId: string };
};

type DashboardScreenNavigationProp = StackNavigationProp<
  OwnerStackParamList,
  'OwnerDashboard'
>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user, profile } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!user || !user.id) {
        console.error('User ID not available');
        return;
      }

      console.log(`Fetching bookings for user ID: ${user.id}`);
      const { data } = await axios.get(`${API_URL}/bookings/owner/${user.id}`);
      console.log(`Fetched ${data.length} bookings`);

      // Fetch pet names and sitter names for each booking
      const bookingsWithDetails = await Promise.all(
        data.map(async (booking: Booking) => {
          try {
            // Get pet name
            const petResponse = await axios.get(
              `${API_URL}/pets/${booking.pet_id}`
            );
            const petName = petResponse.data.name;

            // Get sitter name if assigned
            let sitterName = null;
            if (booking.sitter_id) {
              const sitterResponse = await axios.get(
                `${API_URL}/profiles/${booking.sitter_id}`
              );
              sitterName = `${sitterResponse.data.first_name} ${sitterResponse.data.last_name}`;
            }

            return {
              ...booking,
              pet_name: petName,
              sitter_name: sitterName
            };
          } catch (error) {
            console.error('Error fetching details for booking:', error);
            return booking;
          }
        })
      );

      setBookings(bookingsWithDetails);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // Amber
      case 'confirmed':
        return '#10b981'; // Green
      case 'completed':
        return '#6366f1'; // Indigo
      case 'cancelled':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const handleBookingPress = bookingId => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  const handleViewAllApplications = () => {
    navigation.navigate('Applications');
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingService}>{item.service_type}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.durationText}>{item.duration} hour(s)</Text>
      </View>

      <View style={styles.petDetails}>
        <Text style={styles.petName}>Pet: {item.pet_name || 'Unknown'}</Text>
        {item.sitter_name ? (
          <Text style={styles.sitterName}>Sitter: {item.sitter_name}</Text>
        ) : (
          <Text style={styles.noSitter}>No sitter assigned</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() => handleBookingPress(item.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingService}>{item.service_type} Request</Text>
        <View style={[styles.statusBadge, styles.pendingBadge]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.bookingBody}>
        <View style={styles.bookingDetail}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.bookingText}>{item.sitter_name}</Text>
        </View>

        <View style={styles.bookingDetail}>
          <Ionicons name="paw-outline" size={16} color="#666" />
          <Text style={styles.bookingText}>{item.pet_name}</Text>
        </View>

        <View style={styles.bookingDetail}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.bookingText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.bookingDetail}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.bookingText}>{item.duration} hour(s)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.welcomeSubtext}>
            Manage your pet care bookings and requests here.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {bookings.length > 0 ? (
            <FlatList
              data={bookings.filter(booking => booking.status !== 'completed')}
              renderItem={renderBookingItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No upcoming bookings</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Applications</Text>
            {bookings.length > 0 && (
              <TouchableOpacity onPress={handleViewAllApplications}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {bookings.length > 0 ? (
            <FlatList
              data={bookings.filter(booking => booking.status === 'pending')}
              renderItem={renderApplicationItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No pending applications</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
          </View>

          {bookings.filter(booking => booking.status === 'completed').length >
          0 ? (
            <FlatList
              data={bookings.filter(booking => booking.status === 'completed')}
              renderItem={renderBookingItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No recent bookings</Text>
            </View>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  content: {
    flex: 1
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666'
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  viewAllText: {
    color: '#4f46e5',
    fontWeight: '500'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  applicationCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#faf5ff'
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  bookingService: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  upcomingBadge: {
    backgroundColor: '#fef3c7'
  },
  confirmedBadge: {
    backgroundColor: '#d1fae5'
  },
  completedBadge: {
    backgroundColor: '#e5e7eb'
  },
  pendingBadge: {
    backgroundColor: '#dbeafe'
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  bookingBody: {
    marginTop: 10
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  bookingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333'
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 12
  },
  dateText: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 12
  },
  durationText: {
    fontSize: 14,
    color: '#4b5563'
  },
  petDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12
  },
  petName: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4
  },
  sitterName: {
    fontSize: 14,
    color: '#4b5563'
  },
  noSitter: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  }
});

export default DashboardScreen;
