import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Mock data
const MOCK_SITTER = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  rating: 4.8,
  reviewsCount: 24,
  bio: 'Experienced dog walker and pet sitter with 5+ years of experience. I love all animals! I have two dogs of my own and understand the importance of finding someone you can trust with your furry family members.',
  services: [
    { id: '1', name: 'Dog Walking', price: 25, unit: 'hour' },
    { id: '2', name: 'Pet Sitting', price: 30, unit: 'hour' },
    { id: '3', name: 'Boarding', price: 45, unit: 'night' }
  ],
  availability: [
    { day: 'Monday', hours: '9am - 5pm' },
    { day: 'Tuesday', hours: '9am - 5pm' },
    { day: 'Wednesday', hours: '9am - 5pm' },
    { day: 'Thursday', hours: '9am - 5pm' },
    { day: 'Friday', hours: '9am - 5pm' },
    { day: 'Saturday', hours: '10am - 3pm' },
    { day: 'Sunday', hours: 'Not Available' }
  ],
  experience: '5+ years',
  location: 'Chicago, IL',
  distance: '1.2 miles away',
  reviews: [
    {
      id: '1',
      userName: 'John D.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Sarah took excellent care of my dog Max! He was happy and tired when I got home.'
    },
    {
      id: '2',
      userName: 'Emily R.',
      rating: 5,
      date: '1 month ago',
      text: 'Very professional and reliable. Will book again!'
    },
    {
      id: '3',
      userName: 'Michael T.',
      rating: 4,
      date: '2 months ago',
      text: 'Good service, my cats were well taken care of while I was away.'
    }
  ]
};

const SitterProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedService, setSelectedService] = useState<string>(
    MOCK_SITTER.services[0].id
  );

  // In a real app, you would fetch the sitter data based on the ID
  // const { sitterId } = route.params;
  const sitter = MOCK_SITTER;

  const handleBookNow = () => {
    const service = sitter.services.find(s => s.id === selectedService);
    navigation.navigate('BookingRequest', {
      sitterId: sitter.id,
      serviceId: selectedService,
      serviceName: service?.name,
      price: service?.price
    });
  };

  const handleContact = () => {
    navigation.navigate('Messages', {
      screen: 'MessageChat',
      params: {
        recipientId: sitter.id,
        recipientName: `${sitter.firstName} ${sitter.lastName}`
      }
    });
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.userName}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map(star => (
          <FontAwesome
            key={star}
            name="star"
            size={14}
            color={star <= item.rating ? '#FFC107' : '#E0E0E0'}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>
              {sitter.firstName.charAt(0) + sitter.lastName.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>
            {sitter.firstName} {sitter.lastName}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFC107" />
            <Text style={styles.ratingText}>
              {sitter.rating} ({sitter.reviewsCount} reviews)
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{sitter.distance}</Text>
          </View>
          <Text style={styles.experienceText}>
            {sitter.experience} experience
          </Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{sitter.bio}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Rates</Text>
          {sitter.services.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.selectedServiceCard
              ]}
              onPress={() => setSelectedService(service.id)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>
                  ${service.price}/{service.unit}
                </Text>
              </View>
              <View style={styles.radioButton}>
                {selectedService === service.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {sitter.availability.map((day, index) => (
            <View key={index} style={styles.availabilityRow}>
              <Text style={styles.dayText}>{day.day}</Text>
              <Text style={styles.hoursText}>
                {day.hours === 'Not Available' ? (
                  <Text style={{ color: '#dc2626' }}>{day.hours}</Text>
                ) : (
                  day.hours
                )}
              </Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SitterReviews', { sitterId: sitter.id })
              }
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sitter.reviews}
            renderItem={renderReviewItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Ionicons name="chatbubble-outline" size={20} color="#4f46e5" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
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
    height: 120,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
    marginBottom: 20
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white'
  },
  profileInitials: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#666'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666'
  },
  experienceText: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  seeAllText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500'
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333'
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 10
  },
  selectedServiceCard: {
    borderColor: '#4f46e5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)'
  },
  serviceInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  servicePrice: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: 'bold'
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4f46e5'
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500'
  },
  hoursText: {
    fontSize: 14,
    color: '#4b5563'
  },
  reviewCard: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 10
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600'
  },
  reviewDate: {
    fontSize: 12,
    color: '#6b7280'
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 6
  },
  reviewText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 25,
    marginRight: 10
  },
  contactButtonText: {
    marginLeft: 8,
    color: '#4f46e5',
    fontWeight: '600'
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#4f46e5',
    borderRadius: 25
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default SitterProfileScreen;
