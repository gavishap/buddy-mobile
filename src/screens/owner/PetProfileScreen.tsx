import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the pet profile
const MOCK_PETS = {
  '1': {
    id: '1',
    name: 'Buddy',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 65,
    specialNeeds: 'Needs daily exercise, allergic to chicken',
    imageUri: null, // In a real app, this would be a URL
    vaccinations: [
      { name: 'Rabies', date: '2023-05-15', dueDate: '2024-05-15' },
      { name: 'DHPP', date: '2023-03-10', dueDate: '2024-03-10' },
      { name: 'Bordetella', date: '2023-06-20', dueDate: '2024-06-20' }
    ],
    medications: [
      {
        name: 'Flea and Tick Prevention',
        frequency: 'Monthly',
        lastAdministered: '2023-08-01'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Max',
    type: 'dog',
    breed: 'German Shepherd',
    age: 2,
    weight: 75,
    specialNeeds: 'Sensitive stomach, needs prescription food',
    imageUri: null,
    vaccinations: [
      { name: 'Rabies', date: '2023-04-12', dueDate: '2024-04-12' },
      { name: 'DHPP', date: '2023-04-12', dueDate: '2024-04-12' },
      { name: 'Leptospirosis', date: '2023-04-12', dueDate: '2024-04-12' }
    ],
    medications: []
  },
  '3': {
    id: '3',
    name: 'Lucy',
    type: 'dog',
    breed: 'Beagle',
    age: 4,
    weight: 28,
    specialNeeds: '',
    imageUri: null,
    vaccinations: [
      { name: 'Rabies', date: '2023-02-18', dueDate: '2024-02-18' },
      { name: 'DHPP', date: '2023-02-18', dueDate: '2024-02-18' }
    ],
    medications: [
      {
        name: 'Joint Supplement',
        frequency: 'Daily',
        lastAdministered: '2023-08-15'
      }
    ]
  }
};

type PetParams = {
  petId: string;
};

const PetProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // In a real app, you would fetch the pet data based on the ID
  // For demo purposes, we're using the mock data
  // @ts-ignore - Ignoring type check for demo
  const { petId } = route.params as PetParams;

  // Get the pet from our mock data
  const pet = MOCK_PETS[petId];

  const handleEdit = () => {
    // Navigate to the edit pet screen
    // In a real app, you would implement proper navigation
    Alert.alert(
      'Edit Pet',
      'This feature would allow you to edit the pet profile.'
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to remove this pet from your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the pet
            Alert.alert(
              'Pet Removed',
              'The pet has been removed from your profile.'
            );
            navigation.goBack();
          }
        }
      ]
    );
  };

  // If the pet doesn't exist in our mock data
  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Sorry, this pet could not be found.
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
        <Text style={styles.headerTitle}>{pet.name}'s Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {pet.imageUri ? (
              <Image
                source={{ uri: pet.imageUri }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>{pet.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>
                {pet.age} {pet.age === 1 ? 'year' : 'years'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{pet.weight} lbs</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {pet.specialNeeds ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Needs</Text>
            <Text style={styles.sectionText}>{pet.specialNeeds}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccinations</Text>
          {pet.vaccinations.length > 0 ? (
            pet.vaccinations.map((vaccination, index) => (
              <View key={index} style={styles.vaccinationItem}>
                <View style={styles.vaccinationInfo}>
                  <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                  <Text style={styles.vaccinationDate}>
                    Last: {new Date(vaccination.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.vaccinationDueDate}>
                  Due: {new Date(vaccination.dueDate).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyListText}>No vaccinations recorded</Text>
          )}

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color="#4f46e5" />
            <Text style={styles.addButtonText}>Add Vaccination</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          {pet.medications.length > 0 ? (
            pet.medications.map((medication, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDetails}>
                  {medication.frequency} • Last given:{' '}
                  {new Date(medication.lastAdministered).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyListText}>No medications recorded</Text>
          )}

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color="#4f46e5" />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Remove Pet</Text>
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
  editButton: {
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 10
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileInitials: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white'
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  petBreed: {
    fontSize: 16,
    color: '#6b7280'
  },
  infoSection: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoItem: {
    alignItems: 'center',
    flex: 1
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600'
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  sectionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24
  },
  vaccinationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  vaccinationInfo: {
    flex: 1
  },
  vaccinationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  vaccinationDate: {
    fontSize: 14,
    color: '#6b7280'
  },
  vaccinationDueDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5'
  },
  medicationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  medicationDetails: {
    fontSize: 14,
    color: '#6b7280'
  },
  emptyListText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 15
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10
  },
  addButtonText: {
    marginLeft: 5,
    color: '#4f46e5',
    fontWeight: '500'
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    backgroundColor: 'white'
  },
  deleteButtonText: {
    marginLeft: 8,
    color: '#ef4444',
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

export default PetProfileScreen;
