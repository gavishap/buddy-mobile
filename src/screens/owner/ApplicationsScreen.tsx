import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for applications
const MOCK_APPLICATIONS = {
  '102': [
    {
      id: '201',
      sitterId: '1',
      sitterName: 'Sarah Johnson',
      rating: 4.8,
      reviews: 24,
      message:
        'I would love to watch your pet! I have experience with dogs of all sizes and can provide the care your pet needs.',
      createdAt: '2023-09-01T10:15:00Z',
      price: 30
    },
    {
      id: '202',
      sitterId: '4',
      sitterName: 'David Miller',
      rating: 4.7,
      reviews: 15,
      message:
        "Hi there! I'm available for your requested time and would be happy to care for your pet. I'm a vet tech by profession.",
      createdAt: '2023-09-01T14:30:00Z',
      price: 35
    },
    {
      id: '203',
      sitterId: '5',
      sitterName: 'Amanda Wilson',
      rating: 4.9,
      reviews: 32,
      message:
        'I would be delighted to care for your pet. I have a spacious home with a fenced yard and love spending time with animals.',
      createdAt: '2023-09-02T09:45:00Z',
      price: 28
    }
  ]
};

// Define the types for route params
interface ApplicationParams {
  bookingId: string;
}

interface Application {
  id: string;
  sitterId: string;
  sitterName: string;
  rating: number;
  reviews: number;
  message: string;
  createdAt: string;
  price: number;
}

const ApplicationsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // @ts-ignore - Ignoring type check for demo
  const { bookingId } = route.params as ApplicationParams;

  // Get applications for this booking from mock data
  const applications = MOCK_APPLICATIONS[bookingId] || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const handleAcceptApplication = (application: Application) => {
    Alert.alert(
      'Accept Application',
      `Are you sure you want to accept ${application.sitterName}'s application?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Accept',
          onPress: () => {
            // In a real app, this would call an API to accept the application
            Alert.alert(
              'Application Accepted',
              `You've booked ${application.sitterName}. They have been notified and will contact you soon.`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('OwnerDashboard')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleViewProfile = (sitterId: string) => {
    // Navigate to the sitter profile
    navigation.navigate('FindSitters', {
      screen: 'SitterProfile',
      params: { sitterId: sitterId }
    });
  };

  const renderApplicationItem = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <TouchableOpacity
          style={styles.sitterInfo}
          onPress={() => handleViewProfile(item.sitterId)}
        >
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>
              {item.sitterName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={styles.sitterName}>{item.sitterName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>
                {item.rating} ({item.reviews} reviews)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.applicationDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text style={styles.applicationMessage}>{item.message}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceValue}>${item.price}/hr</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptApplication(item)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => {
            // Navigate to message screen
            navigation.navigate('Messages', {
              screen: 'MessageChat',
              params: {
                recipientId: item.sitterId,
                recipientName: item.sitterName
              }
            });
          }}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#4f46e5" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applications</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {applications.length > 0 ? (
          <FlatList
            data={applications}
            renderItem={renderApplicationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.applicationsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Applications Yet</Text>
            <Text style={styles.emptyStateMessage}>
              Your booking hasn't received any applications from sitters yet.
              Check back later or modify your booking details to attract more
              sitters.
            </Text>
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
    flex: 1
  },
  applicationsList: {
    padding: 15
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  sitterInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  profileInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sitterName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6b7280'
  },
  applicationDate: {
    fontSize: 12,
    color: '#6b7280'
  },
  applicationMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 5
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 8
  },
  messageButtonText: {
    marginLeft: 5,
    color: '#4f46e5',
    fontWeight: '500'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b5563',
    marginTop: 20,
    marginBottom: 10
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 20
  }
});

export default ApplicationsScreen;
