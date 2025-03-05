import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PetCard } from '../components/PetCard';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';
import { getPets, Pet, deletePet } from '../api/pets';
import { handleApiError } from '../api';

type PetsScreenNavigationProp = StackNavigationProp<any, 'Pets'>;

export const PetsScreen: React.FC = () => {
  const navigation = useNavigation<PetsScreenNavigationProp>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError(handleApiError(err, 'Failed to load pets'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  const handleAddPet = () => {
    navigation.navigate('AddPet');
  };

  const handleEditPet = (pet: Pet) => {
    navigation.navigate('EditPet', { pet });
  };

  const handleViewPet = (pet: Pet) => {
    navigation.navigate('PetDetail', { pet });
  };

  const handleDeletePet = (pet: Pet) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (pet.id) {
                await deletePet(pet.id);
                setPets(currentPets =>
                  currentPets.filter(p => p.id !== pet.id)
                );
              }
            } catch (err) {
              Alert.alert('Error', handleApiError(err, 'Failed to delete pet'));
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPets();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchPets}
          variant="primary"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Pets</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="paw" size={80} color={Colors.primary} />
          <Text style={styles.emptyText}>You don't have any pets yet</Text>
          <Button
            title="Add Your First Pet"
            onPress={handleAddPet}
            variant="primary"
            style={styles.addFirstPetButton}
          />
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={item => item.id || item.name}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => handleViewPet(item)}
              onEdit={() => handleEditPet(item)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center'
  },
  addFirstPetButton: {
    minWidth: 200
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    minWidth: 120
  }
});
