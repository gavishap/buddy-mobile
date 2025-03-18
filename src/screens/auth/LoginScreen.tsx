import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OwnerSignup: undefined;
  SitterSignup: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>(
    'error'
  );
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  // Function to show feedback toast
  const showFeedbackToast = (type: 'success' | 'error', message: string) => {
    setFeedbackType(type);
    setFeedbackMessage(message);
    setShowFeedback(true);

    // Animate the toast in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    // Hide the toast after 3 seconds
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setShowFeedback(false);
      });
    }, 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showFeedbackToast('error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        const errorMessage = error.message || 'Failed to sign in';

        // Check if the error is related to incorrect password
        if (
          errorMessage.toLowerCase().includes('password') ||
          errorMessage.toLowerCase().includes('credentials')
        ) {
          showFeedbackToast('error', 'Incorrect password. Please try again.');
        } else {
          showFeedbackToast('error', errorMessage);
        }
      } else {
        showFeedbackToast('success', 'Login successful!');
      }
    } catch (error) {
      showFeedbackToast('error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <View style={styles.signupOptions}>
          <TouchableOpacity onPress={() => navigation.navigate('OwnerSignup')}>
            <Text style={styles.link}>Sign up as Owner</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SitterSignup')}>
            <Text style={styles.link}>Sign up as Sitter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feedback Toast */}
      {showFeedback && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            feedbackType === 'success'
              ? styles.successContainer
              : styles.errorContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.feedbackIconContainer}>
            <MaterialIcons
              name={feedbackType === 'success' ? 'check-circle' : 'error'}
              size={24}
              color="white"
            />
          </View>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20
  },
  header: {
    marginTop: 60,
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8
  },
  form: {
    marginBottom: 30
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: {
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8
  },
  signupOptions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  link: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500'
  },
  separator: {
    marginHorizontal: 8,
    color: '#d1d5db'
  },
  // Feedback toast styles
  feedbackContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  successContainer: {
    backgroundColor: '#10B981' // green
  },
  errorContainer: {
    backgroundColor: '#EF4444' // red
  },
  feedbackIconContainer: {
    marginRight: 12
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1
  }
});

export default LoginScreen;
