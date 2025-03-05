import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OwnerSignup: undefined;
  SitterSignup: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Waggy Sitters</Text>
        <Text style={styles.tagline}>
          Find the perfect pet sitter for your furry friend
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {/* Placeholder for app logo/illustration */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🐕</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('OwnerSignup')}
        >
          <Text style={styles.secondaryButtonText}>Sign Up as Pet Owner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('SitterSignup')}
        >
          <Text style={styles.secondaryButtonText}>Sign Up as Pet Sitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholderText: {
    fontSize: 80
  },
  buttonContainer: {
    marginBottom: 40
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 8
  },
  primaryButton: {
    backgroundColor: '#4f46e5'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4f46e5'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600'
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 10
  }
});

export default WelcomeScreen;
