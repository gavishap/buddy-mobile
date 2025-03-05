import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Pet } from '../api/pets';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
  onEdit?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onPress,
  onEdit,
  style,
  compact = false
}) => {
  const defaultImage = require('../../assets/images/pet-placeholder.png');

  const renderCompactCard = () => (
    <TouchableOpacity
      style={[styles.compactContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={pet.image_url ? { uri: pet.image_url } : defaultImage}
        style={styles.compactImage}
      />
      <View style={styles.compactInfo}>
        <Text style={styles.compactName}>{pet.name}</Text>
        <Text style={styles.compactBreed}>{pet.breed}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFullCard = () => (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image
          source={pet.image_url ? { uri: pet.image_url } : defaultImage}
          style={styles.image}
        />
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{pet.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Breed:</Text>
          <Text style={styles.detailValue}>{pet.breed}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>
            {pet.age} {pet.age === 1 ? 'year' : 'years'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>
            {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
          </Text>
        </View>

        {pet.description && (
          <View style={styles.description}>
            <Text style={styles.descriptionLabel}>About</Text>
            <Text style={styles.descriptionText}>{pet.description}</Text>
          </View>
        )}

        {pet.special_requirements && (
          <View style={styles.description}>
            <Text style={styles.descriptionLabel}>Special Requirements</Text>
            <Text style={styles.descriptionText}>
              {pet.special_requirements}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return compact ? renderCompactCard() : renderFullCard();
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16
  },
  header: {
    position: 'relative'
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    padding: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    width: 100
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  description: {
    marginTop: 12
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center'
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12
  },
  compactInfo: {
    flex: 1
  },
  compactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  compactBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  }
});
