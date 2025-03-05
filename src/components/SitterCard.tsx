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
import { SitterProfile } from '../api/profiles';

interface SitterCardProps {
  sitter: SitterProfile;
  onPress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const SitterCard: React.FC<SitterCardProps> = ({
  sitter,
  onPress,
  style,
  compact = false
}) => {
  const defaultImage = require('../../assets/images/user-placeholder.png');

  const renderServiceBadges = () => {
    return (
      <View style={styles.serviceBadges}>
        {sitter.services.includes('walking') && (
          <View style={styles.serviceBadge}>
            <Ionicons name="footsteps" size={16} color="#fff" />
            <Text style={styles.serviceBadgeText}>Walking</Text>
          </View>
        )}
        {sitter.services.includes('boarding') && (
          <View style={styles.serviceBadge}>
            <Ionicons name="home" size={16} color="#fff" />
            <Text style={styles.serviceBadgeText}>Boarding</Text>
          </View>
        )}
        {sitter.services.includes('sitting') && (
          <View style={styles.serviceBadge}>
            <Ionicons name="person" size={16} color="#fff" />
            <Text style={styles.serviceBadgeText}>Sitting</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCompactCard = () => (
    <TouchableOpacity
      style={[styles.compactContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={sitter.avatar_url ? { uri: sitter.avatar_url } : defaultImage}
        style={styles.compactImage}
      />
      <View style={styles.compactInfo}>
        <Text style={styles.compactName}>
          {sitter.first_name} {sitter.last_name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={Colors.tertiary} />
          <Text style={styles.ratingText}>4.8</Text>
          <Text style={styles.reviewCount}>(24 reviews)</Text>
        </View>
        {sitter.hourly_rate && (
          <Text style={styles.compactRate}>${sitter.hourly_rate}/hr</Text>
        )}
      </View>
      <View style={styles.availabilityBadge}>
        <Text style={styles.availabilityText}>
          {sitter.is_available ? 'Available' : 'Unavailable'}
        </Text>
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
          source={sitter.avatar_url ? { uri: sitter.avatar_url } : defaultImage}
          style={styles.image}
        />
        <View style={styles.headerOverlay}>
          <View
            style={[
              styles.availabilityIndicator,
              {
                backgroundColor: sitter.is_available
                  ? Colors.success
                  : Colors.error
              }
            ]}
          >
            <Text style={styles.availabilityIndicatorText}>
              {sitter.is_available ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {sitter.first_name} {sitter.last_name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color={Colors.tertiary} />
          <Text style={styles.ratingValue}>4.8</Text>
          <Text style={styles.reviewCount}>(24 reviews)</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color={Colors.primary} />
          <Text style={styles.locationText}>
            {sitter.city}, {sitter.state}
          </Text>
        </View>

        {renderServiceBadges()}

        <View style={styles.rateRow}>
          {sitter.hourly_rate && (
            <View style={styles.rate}>
              <Text style={styles.rateValue}>${sitter.hourly_rate}</Text>
              <Text style={styles.rateLabel}>/hour</Text>
            </View>
          )}

          {sitter.daily_rate && (
            <View style={styles.rate}>
              <Text style={styles.rateValue}>${sitter.daily_rate}</Text>
              <Text style={styles.rateLabel}>/day</Text>
            </View>
          )}
        </View>

        {sitter.bio && (
          <View style={styles.bio}>
            <Text style={styles.bioLabel}>About me</Text>
            <Text style={styles.bioText}>{sitter.bio}</Text>
          </View>
        )}

        {sitter.experience_years && (
          <View style={styles.experience}>
            <Ionicons name="briefcase" size={18} color={Colors.primary} />
            <Text style={styles.experienceText}>
              {sitter.experience_years}{' '}
              {sitter.experience_years === 1 ? 'year' : 'years'} of experience
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
    height: 200,
    resizeMode: 'cover'
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  availabilityIndicator: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16
  },
  availabilityIndicatorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  info: {
    padding: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4
  },
  serviceBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  serviceBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4
  },
  rateRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  rate: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary
  },
  rateLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2
  },
  bio: {
    marginBottom: 12
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4
  },
  bioText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22
  },
  experience: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  experienceText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 8
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333'
  },
  compactRate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 4
  },
  availabilityBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
