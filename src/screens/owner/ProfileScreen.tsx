import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

// Mock data for demonstration
const MOCK_PROFILE = {
  id: '123',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '555-123-4567',
  address: '123 Main St, Anytown, CA 12345',
  profileImage: null, // In a real app, this would be a URI
  joinDate: 'March 2022'
};

const MOCK_PETS = [
  {
    id: '1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    image: null
  },
  {
    id: '2',
    name: 'Bella',
    type: 'Dog',
    breed: 'Beagle',
    age: 2,
    image: null
  }
];

const MOCK_BOOKINGS = [
  {
    id: '1',
    sitterName: 'Sarah Johnson',
    service: 'Dog Walking',
    date: '2023-05-15',
    status: 'completed'
  },
  {
    id: '2',
    sitterName: 'Michael Brown',
    service: 'Pet Sitting',
    date: '2023-05-20',
    status: 'upcoming'
  }
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [pets, setPets] = useState(MOCK_PETS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to profile edit screen');
  };

  const handleAddPet = () => {
    // In a real app, navigate to the create pet screen
    navigation.navigate('CreatePetProfile');
  };

  const handleViewPet = petId => {
    // In a real app, navigate to the pet profile screen
    navigation.navigate('PetProfile', { petId });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await signOut();
            // No need to navigate as the Navigation component will automatically redirect to Auth
            console.log('User signed out successfully');
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert(
              'Error',
              'There was a problem signing out. Please try again.'
            );
          }
        }
      }
    ]);
  };

  const renderPetItem = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => handleViewPet(item.id)}
    >
      <View style={styles.petImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.petImage} />
        ) : (
          <View style={styles.petImagePlaceholder}>
            <Ionicons name="paw" size={30} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.petInfo}>
        {item.breed}, {item.age} {item.age === 1 ? 'year' : 'years'}
      </Text>
    </TouchableOpacity>
  );

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingService}>{item.service}</Text>
        <Text style={styles.bookingDetails}>
          with {item.sitterName} on {item.date}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === 'completed'
            ? styles.completedBadge
            : styles.upcomingBadge
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profile.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {profile.firstName.charAt(0) + profile.lastName.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editProfileImageButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity onPress={handleAddPet}>
              <View style={styles.addButton}>
                <Ionicons name="add" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {pets.length > 0 ? (
            <FlatList
              data={pets}
              renderItem={renderPetItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petsContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="paw" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No pets added yet</Text>
              <TouchableOpacity
                style={styles.addPetButton}
                onPress={handleAddPet}
              >
                <Text style={styles.addPetButtonText}>Add a Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <View key={booking.id} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingService}>{booking.service}</Text>
                  <Text style={styles.bookingDetails}>
                    with {booking.sitterName} on {booking.date}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    booking.status === 'completed'
                      ? styles.completedBadge
                      : styles.upcomingBadge
                  ]}
                >
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No bookings yet</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.accountInfo}>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Email:</Text>
              <Text style={styles.accountValue}>{profile.email}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Phone:</Text>
              <Text style={styles.accountValue}>{profile.phone}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Address:</Text>
              <Text style={styles.accountValue}>{profile.address}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Member Since:</Text>
              <Text style={styles.accountValue}>{profile.joinDate}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImagePlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white'
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4f46e5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  editProfileButtonText: {
    color: '#4f46e5',
    fontWeight: '500'
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
    fontWeight: 'bold',
    marginBottom: 15
  },
  addButton: {
    backgroundColor: '#4f46e5',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  petsContainer: {
    paddingBottom: 10
  },
  petCard: {
    width: 120,
    marginRight: 15,
    alignItems: 'center'
  },
  petImageContainer: {
    marginBottom: 10
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  petImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  petInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  emptyState: {
    alignItems: 'center',
    padding: 20
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    marginBottom: 15
  },
  addPetButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  addPetButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  bookingInfo: {
    flex: 1
  },
  bookingService: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  bookingDetails: {
    fontSize: 14,
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  completedBadge: {
    backgroundColor: '#d1fae5'
  },
  upcomingBadge: {
    backgroundColor: '#fef3c7'
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  accountInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 15
  },
  accountRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  accountLabel: {
    width: 100,
    fontSize: 14,
    color: '#666'
  },
  accountValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 8
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    marginLeft: 8
  }
});

export default ProfileScreen;
