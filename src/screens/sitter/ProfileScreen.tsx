import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Mock data for demonstration
const MOCK_PROFILE = {
  id: '123',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '555-123-4567',
  address: '123 Main St, Anytown, CA 12345',
  bio: 'Dog lover with 5+ years of professional experience. Certified in pet first aid and CPR. I treat every pet as if they were my own!',
  profileImage: null, // In a real app, this would be a URI
  rating: 4.8,
  reviewsCount: 24,
  services: {
    dogWalking: true,
    petSitting: true,
    boarding: false
  },
  rates: {
    dogWalking: 25,
    petSitting: 35,
    boarding: 50
  },
  availabilityStatus: true,
  joinDate: 'March 2022'
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [isAvailable, setIsAvailable] = useState(profile.availabilityStatus);

  const toggleAvailability = value => {
    setIsAvailable(value);
    // In a real app, update this in the backend
    setProfile({ ...profile, availabilityStatus: value });
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to profile edit screen');
  };

  const handleManageAvailability = () => {
    Alert.alert(
      'Manage Availability',
      'Navigate to availability management screen'
    );
  };

  const handleViewReviews = () => {
    Alert.alert('View Reviews', 'Navigate to reviews screen');
  };

  const handleManageServices = () => {
    Alert.alert('Manage Services', 'Navigate to services management screen');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: () => {
          // In a real app, implement logout logic here
          Alert.alert('Logged Out', 'You have been logged out successfully');
        }
      }
    ]);
  };

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

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>
              {profile.rating} ({profile.reviewsCount} reviews)
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Availability Status</Text>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#D1FAE5' }}
              thumbColor={isAvailable ? '#10B981' : '#9CA3AF'}
              ios_backgroundColor="#E5E5E5"
              onValueChange={toggleAvailability}
              value={isAvailable}
            />
          </View>
          <Text style={styles.availabilityText}>
            {isAvailable
              ? 'You are currently available for bookings'
              : 'You are currently unavailable for bookings'}
          </Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManageAvailability}
          >
            <Text style={styles.manageButtonText}>Manage Availability</Text>
            <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Rates</Text>

          {profile.services.dogWalking && (
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>Dog Walking</Text>
              </View>
              <Text style={styles.serviceRate}>
                ${profile.rates.dogWalking}/hr
              </Text>
            </View>
          )}

          {profile.services.petSitting && (
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>Pet Sitting</Text>
              </View>
              <Text style={styles.serviceRate}>
                ${profile.rates.petSitting}/hr
              </Text>
            </View>
          )}

          {profile.services.boarding && (
            <View style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>Boarding</Text>
              </View>
              <Text style={styles.serviceRate}>
                ${profile.rates.boarding}/night
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManageServices}
          >
            <Text style={styles.manageButtonText}>Manage Services</Text>
            <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={handleViewReviews}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {profile.reviewsCount > 0 ? (
            <View style={styles.reviewSummary}>
              <View style={styles.ratingStars}>
                <Ionicons name="star" size={24} color="#FFC107" />
                <Ionicons name="star" size={24} color="#FFC107" />
                <Ionicons name="star" size={24} color="#FFC107" />
                <Ionicons name="star" size={24} color="#FFC107" />
                <Ionicons name="star-half" size={24} color="#FFC107" />
              </View>
              <Text style={styles.ratingNumber}>{profile.rating}</Text>
              <Text style={styles.reviewCount}>
                Based on {profile.reviewsCount} reviews
              </Text>
            </View>
          ) : (
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyReviewsText}>No reviews yet</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
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
    marginBottom: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666'
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
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  availabilityText: {
    color: '#666',
    marginBottom: 15
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  manageButtonText: {
    color: '#4f46e5',
    fontWeight: '500'
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333'
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500'
  },
  serviceRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  viewAllText: {
    color: '#4f46e5',
    fontWeight: '500'
  },
  reviewSummary: {
    alignItems: 'center',
    padding: 15
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 10
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  reviewCount: {
    color: '#666'
  },
  emptyReviews: {
    alignItems: 'center',
    padding: 20
  },
  emptyReviewsText: {
    color: '#666'
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
