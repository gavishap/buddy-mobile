import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Define the types for navigation and pet type
type PetType = 'dog' | 'cat' | 'other';

interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  specialNeeds?: string;
  imageUri?: string;
}

const CreatePetProfileScreen = () => {
  const navigation = useNavigation();

  const [petName, setPetName] = useState<string>('');
  const [petType, setPetType] = useState<PetType>('dog');
  const [breed, setBreed] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [specialNeeds, setSpecialNeeds] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'You need to allow access to your photos to upload an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!petName.trim()) {
      Alert.alert('Error', "Please enter your pet's name");
      return false;
    }

    if (!breed.trim()) {
      Alert.alert('Error', "Please enter your pet's breed");
      return false;
    }

    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }

    if (!weight.trim() || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // In a real app, this would send the pet data to the API
    const newPet: Pet = {
      id: Date.now().toString(), // Using timestamp as temp ID
      name: petName,
      type: petType,
      breed: breed,
      age: Number(age),
      weight: Number(weight),
      specialNeeds: specialNeeds.trim() || undefined,
      imageUri: imageUri || undefined
    };

    // Mock saving pet (in a real app we'd call an API here)
    Alert.alert('Pet Added', `${petName} has been added to your profile!`, [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ]);
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
        <Text style={styles.headerTitle}>Add a Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.petImage} />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#a1a1aa" />
                <Text style={styles.imagePickerText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pet Name *</Text>
          <TextInput
            style={styles.input}
            value={petName}
            onChangeText={setPetName}
            placeholder="Enter your pet's name"
          />

          <Text style={styles.label}>Pet Type *</Text>
          <View style={styles.petTypeContainer}>
            <TouchableOpacity
              style={[
                styles.petTypeButton,
                petType === 'dog' && styles.selectedPetTypeButton
              ]}
              onPress={() => setPetType('dog')}
            >
              <Ionicons
                name="paw"
                size={20}
                color={petType === 'dog' ? 'white' : '#4f46e5'}
              />
              <Text
                style={[
                  styles.petTypeText,
                  petType === 'dog' && styles.selectedPetTypeText
                ]}
              >
                Dog
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.petTypeButton,
                petType === 'cat' && styles.selectedPetTypeButton
              ]}
              onPress={() => setPetType('cat')}
            >
              <Ionicons
                name="paw"
                size={20}
                color={petType === 'cat' ? 'white' : '#4f46e5'}
              />
              <Text
                style={[
                  styles.petTypeText,
                  petType === 'cat' && styles.selectedPetTypeText
                ]}
              >
                Cat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.petTypeButton,
                petType === 'other' && styles.selectedPetTypeButton
              ]}
              onPress={() => setPetType('other')}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={petType === 'other' ? 'white' : '#4f46e5'}
              />
              <Text
                style={[
                  styles.petTypeText,
                  petType === 'other' && styles.selectedPetTypeText
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
            placeholder="Enter breed"
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Age (years) *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Weight (lbs) *</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Weight"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Special Needs or Notes</Text>
          <TextInput
            style={styles.textArea}
            value={specialNeeds}
            onChangeText={setSpecialNeeds}
            placeholder="Any medical conditions, dietary needs, or behavior notes"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Pet</Text>
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
    flex: 1,
    padding: 15
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginTop: 10
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagePickerText: {
    marginTop: 5,
    color: '#71717a',
    fontSize: 12
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 16
  },
  petTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  petTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 8
  },
  selectedPetTypeButton: {
    backgroundColor: '#4f46e5'
  },
  petTypeText: {
    marginLeft: 5,
    color: '#4f46e5',
    fontWeight: '500'
  },
  selectedPetTypeText: {
    color: 'white'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfField: {
    width: '48%'
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CreatePetProfileScreen;
