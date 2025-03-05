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
const MOCK_APPLICATION = {
  id: '1',
  ownerName: 'Emily Davis',
  ownerPhone: '555-987-6543',
  ownerEmail: 'emily.davis@example.com',
  petName: 'Luna',
  petType: 'Dog',
  petBreed: 'Beagle',
  service: 'Dog Walking',
  date: '2023-05-20',
  time: '12:00 - 15:00',
  duration: '3 hours',
  location: '456 Oak St, Anytown, CA 12345',
  specialInstructions:
    'Luna is friendly but gets anxious around larger dogs. Please avoid dog parks.',
  status: 'pending',
  payment: '$60.00'
};

const ApplicationDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // In a real app, you would fetch the application data based on the ID
  // const { applicationId } = route.params;
  const application = MOCK_APPLICATION;

  const handleAcceptApplication = () => {
    Alert.alert(
      'Accept Application',
      'Are you sure you want to accept this booking application?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Accept',
          onPress: () => {
            // Logic to accept application
            Alert.alert(
              'Application Accepted',
              'You have successfully accepted this booking application.',
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

  const handleDeclineApplication = () => {
    Alert.alert(
      'Decline Application',
      'Are you sure you want to decline this booking application?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // Logic to decline application
            Alert.alert(
              'Application Declined',
              'You have declined this booking application.',
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
        <Text style={styles.headerTitle}>Application Details</Text>
        <View style={styles.rightHeader} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View
            style={[
              styles.statusBadge,
              application.status === 'pending'
                ? styles.pendingBadge
                : styles.confirmedBadge
            ]}
          >
            <Text style={styles.statusText}>{application.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service Type:</Text>
              <Text style={styles.infoValue}>{application.service}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{application.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{application.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{application.duration}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment:</Text>
              <Text style={styles.infoValue}>{application.payment}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.address}>{application.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{application.ownerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{application.ownerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{application.ownerEmail}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{application.petName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{application.petType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Breed:</Text>
              <Text style={styles.infoValue}>{application.petBreed}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.instructions}>
              {application.specialInstructions}
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

          {application.status === 'pending' && (
            <>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptApplication}
              >
                <Text style={styles.acceptButtonText}>Accept Application</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineButton}
                onPress={handleDeclineApplication}
              >
                <Text style={styles.declineButtonText}>
                  Decline Application
                </Text>
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
  acceptButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  declineButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  declineButtonText: {
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

export default ApplicationDetailScreen;
