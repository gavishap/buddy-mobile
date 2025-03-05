import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Dummy data for demonstration
const DUMMY_BOOKINGS = [
  {
    id: '1',
    ownerName: 'John Smith',
    petName: 'Max',
    date: '2023-05-15',
    time: '14:00 - 16:00',
    status: 'confirmed',
    service: 'Dog Walking'
  },
  {
    id: '2',
    ownerName: 'Sarah Johnson',
    petName: 'Bella',
    date: '2023-05-16',
    time: '09:00 - 10:00',
    status: 'confirmed',
    service: 'Dog Walking'
  },
  {
    id: '3',
    ownerName: 'Michael Brown',
    petName: 'Charlie',
    date: '2023-05-18',
    time: '19:00 - 21:00',
    status: 'pending',
    service: 'Pet Sitting'
  }
];

const DUMMY_APPLICATIONS = [
  {
    id: '1',
    ownerName: 'Emily Davis',
    petName: 'Luna',
    date: '2023-05-20',
    time: '12:00 - 15:00',
    status: 'pending',
    service: 'Dog Walking'
  },
  {
    id: '2',
    ownerName: 'Daniel Wilson',
    petName: 'Cooper',
    date: '2023-05-22',
    time: '16:00 - 18:00',
    status: 'pending',
    service: 'Pet Sitting'
  }
];

const DashboardScreen = () => {
  const navigation = useNavigation();

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('BookingDetail', { bookingId: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'confirmed'
              ? styles.confirmedBadge
              : styles.pendingBadge
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Owner:</Text>
        <Text style={styles.detailValue}>{item.ownerName}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Pet:</Text>
        <Text style={styles.detailValue}>{item.petName}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Date:</Text>
        <Text style={styles.detailValue}>{item.date}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Time:</Text>
        <Text style={styles.detailValue}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ApplicationDetail', { applicationId: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.service} Application</Text>
        <View style={[styles.statusBadge, styles.pendingBadge]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Owner:</Text>
        <Text style={styles.detailValue}>{item.ownerName}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Pet:</Text>
        <Text style={styles.detailValue}>{item.petName}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Date:</Text>
        <Text style={styles.detailValue}>{item.date}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.detailLabel}>Time:</Text>
        <Text style={styles.detailValue}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sitter Dashboard</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
        </View>
        {DUMMY_BOOKINGS.length > 0 ? (
          <FlatList
            data={DUMMY_BOOKINGS}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
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
          <Text style={styles.sectionTitle}>Booking Applications</Text>
        </View>
        {DUMMY_APPLICATIONS.length > 0 ? (
          <FlatList
            data={DUMMY_APPLICATIONS}
            renderItem={renderApplicationItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No pending applications</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    padding: 20,
    backgroundColor: '#4f46e5'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  section: {
    flex: 1,
    padding: 15
  },
  sectionHeader: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  confirmedBadge: {
    backgroundColor: '#d1fae5'
  },
  pendingBadge: {
    backgroundColor: '#fef3c7'
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardDetails: {
    flexDirection: 'row',
    marginBottom: 5
  },
  detailLabel: {
    width: 50,
    fontSize: 14,
    color: '#666'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  }
});

export default DashboardScreen;
