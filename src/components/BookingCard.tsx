import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors } from '../constants/Colors';
import { Booking } from '../api/bookings';

interface BookingCardProps {
  booking: Booking;
  petName: string;
  sitterName?: string;
  ownerName?: string;
  onPress?: () => void;
  style?: ViewStyle;
  showActions?: boolean;
  onCancel?: () => void;
  onMessage?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  petName,
  sitterName,
  ownerName,
  onPress,
  style,
  showActions = true,
  onCancel,
  onMessage
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
        return Colors.success;
      case 'rejected':
      case 'cancelled':
        return Colors.error;
      case 'completed':
        return Colors.primary;
      default:
        return '#999';
    }
  };

  const getServiceTypeIcon = () => {
    switch (booking.service_type) {
      case 'walking':
        return 'footsteps';
      case 'boarding':
        return 'home';
      case 'sitting':
        return 'person';
      default:
        return 'paw';
    }
  };

  const formatServiceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.serviceType}>
          <Ionicons name={getServiceTypeIcon()} size={20} color="#fff" />
          <Text style={styles.serviceTypeText}>
            {formatServiceType(booking.service_type)}
          </Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Pet:</Text>
          <Text style={styles.value}>{petName}</Text>
        </View>

        {sitterName && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Sitter:</Text>
            <Text style={styles.value}>{sitterName}</Text>
          </View>
        )}

        {ownerName && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Owner:</Text>
            <Text style={styles.value}>{ownerName}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{formatDate(booking.start_date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{formatDate(booking.end_date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.priceValue}>${booking.price.toFixed(2)}</Text>
        </View>

        {booking.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesContent}>{booking.notes}</Text>
          </View>
        )}
      </View>

      {showActions &&
        (booking.status === 'pending' || booking.status === 'accepted') && (
          <View style={styles.actions}>
            {onMessage && (
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton]}
                onPress={onMessage}
              >
                <Ionicons name="chatbubble" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
            )}

            {onCancel &&
              booking.status !== 'cancelled' &&
              booking.status !== 'completed' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Ionicons name="close-circle" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
          </View>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  serviceType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16
  },
  serviceTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  content: {
    padding: 16
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  label: {
    width: 70,
    fontSize: 15,
    color: '#666',
    fontWeight: '500'
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  },
  priceValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold'
  },
  notes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  notesLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4
  },
  notesContent: {
    fontSize: 15,
    color: '#333'
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12
  },
  messageButton: {
    backgroundColor: Colors.primary
  },
  cancelButton: {
    backgroundColor: Colors.error
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8
  }
});
