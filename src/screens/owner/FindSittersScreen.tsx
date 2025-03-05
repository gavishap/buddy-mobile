import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const MOCK_SITTERS = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    rating: 4.8,
    reviewsCount: 24,
    services: ['Dog Walking', 'Pet Sitting'],
    price: 25,
    bio: 'Experienced dog walker and pet sitter with 5+ years of experience. I love all animals!',
    distance: 1.2
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    rating: 4.6,
    reviewsCount: 18,
    services: ['Dog Walking', 'Pet Sitting', 'Boarding'],
    price: 30,
    bio: 'Professional pet care provider who treats your pets like family. Available 7 days a week.',
    distance: 2.5
  },
  {
    id: '3',
    firstName: 'Jessica',
    lastName: 'Williams',
    rating: 4.9,
    reviewsCount: 32,
    services: ['Dog Walking', 'Pet Sitting'],
    price: 28,
    bio: 'Animal lover with a spacious home and fenced yard. Your pet will have a great time!',
    distance: 3.1
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Miller',
    rating: 4.7,
    reviewsCount: 15,
    services: ['Dog Walking', 'Boarding'],
    price: 35,
    bio: 'Vet tech by profession, pet sitter by passion. Your pets are in safe hands with me.',
    distance: 4.0
  }
];

const FindSittersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sitters, setSitters] = useState(MOCK_SITTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedService, setSelectedService] = useState('All');

  const services = ['All', 'Dog Walking', 'Pet Sitting', 'Boarding'];

  const handleSitterPress = sitterId => {
    navigation.navigate('SitterProfile', { sitterId });
  };

  const handleFilterPress = () => {
    setFilterVisible(!filterVisible);
  };

  const handleServiceSelect = service => {
    setSelectedService(service);

    if (service === 'All') {
      setSitters(MOCK_SITTERS);
    } else {
      const filtered = MOCK_SITTERS.filter(sitter =>
        sitter.services.includes(service)
      );
      setSitters(filtered);
    }
  };

  const handleSearch = text => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setSitters(MOCK_SITTERS);
      return;
    }

    const filtered = MOCK_SITTERS.filter(
      sitter =>
        `${sitter.firstName} ${sitter.lastName}`
          .toLowerCase()
          .includes(text.toLowerCase()) ||
        sitter.bio.toLowerCase().includes(text.toLowerCase())
    );
    setSitters(filtered);
  };

  const renderSitterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sitterCard}
      onPress={() => handleSitterPress(item.id)}
    >
      <View style={styles.sitterHeader}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>
            {item.firstName.charAt(0) + item.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.sitterInfo}>
          <Text style={styles.sitterName}>
            {item.firstName} {item.lastName}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewsCount} reviews)
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sitterBio} numberOfLines={2}>
        {item.bio}
      </Text>

      <View style={styles.servicesContainer}>
        {item.services.map((service, index) => (
          <View key={index} style={styles.serviceTag}>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sitterFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.price}>${item.price}/hr</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.distanceText}>{item.distance} miles away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Sitters</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sitters..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Ionicons name="options-outline" size={22} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {filterVisible && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollView}
          >
            {services.map(service => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.serviceButton,
                  selectedService === service && styles.selectedServiceButton
                ]}
                onPress={() => handleServiceSelect(service)}
              >
                <Text
                  style={[
                    styles.serviceButtonText,
                    selectedService === service && styles.selectedServiceText
                  ]}
                >
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={sitters}
        renderItem={renderSitterItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.sittersList}
        showsVerticalScrollIndicator={false}
      />

      {sitters.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No sitters found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your filters
          </Text>
        </View>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16
  },
  filterButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8
  },
  filterContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  servicesScrollView: {
    paddingBottom: 5
  },
  serviceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
    backgroundColor: 'white'
  },
  selectedServiceButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5'
  },
  serviceButtonText: {
    color: '#333',
    fontWeight: '500'
  },
  selectedServiceText: {
    color: 'white'
  },
  sittersList: {
    padding: 15
  },
  sitterCard: {
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
  sitterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  sitterInfo: {
    marginLeft: 12,
    flex: 1
  },
  sitterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666'
  },
  sitterBio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  serviceTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8
  },
  serviceText: {
    fontSize: 12,
    color: '#4b5563'
  },
  sitterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666'
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666'
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666'
  }
});

export default FindSittersScreen;
