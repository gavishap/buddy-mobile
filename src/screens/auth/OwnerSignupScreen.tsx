import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';

const OwnerSignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation state
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong' | ''
  >('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Toast notification state
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

  // Check password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      setPasswordFeedback('');
      return;
    }

    // Check password strength
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const passedChecks = [
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      hasSpecialChars,
      isLongEnough
    ].filter(Boolean).length;

    if (passedChecks <= 2) {
      setPasswordStrength('weak');
      setPasswordFeedback(
        'Password is weak. Add uppercase, numbers, or special characters.'
      );
    } else if (passedChecks <= 4) {
      setPasswordStrength('medium');
      setPasswordFeedback(
        'Password is medium strength. Add more variety for stronger security.'
      );
    } else {
      setPasswordStrength('strong');
      setPasswordFeedback('Password is strong!');
    }

    // Check if passwords match whenever either password field changes
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSignup = async () => {
    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      showFeedbackToast('error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      showFeedbackToast('error', 'Passwords do not match');
      return;
    }

    if (passwordStrength === 'weak') {
      showFeedbackToast(
        'error',
        'Password is too weak. Please make it stronger.'
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedbackToast('error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone,
        user_type: 'owner'
      });

      setIsLoading(false);

      if (error) {
        showFeedbackToast(
          'error',
          error.message || 'An error occurred during registration'
        );
      } else {
        showFeedbackToast(
          'success',
          'Your account has been created successfully!'
        );
        // Navigate to login after showing success message
        setTimeout(() => navigation.navigate('Login'), 2000);
      }
    } catch (error) {
      setIsLoading(false);
      showFeedbackToast(
        'error',
        'An unexpected error occurred. Please try again later.'
      );
      console.error('Signup error:', error);
    }
  };

  // Get the color for password strength indicator
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return '#EF4444'; // red
      case 'medium':
        return '#F59E0B'; // amber
      case 'strong':
        return '#10B981'; // green
      default:
        return '#D1D5DB'; // gray
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Owner Account</Text>
            <Text style={styles.subtitle}>
              Fill out the form below to create your account
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter last name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Password strength indicator */}
              {password && (
                <View style={styles.passwordFeedbackContainer}>
                  <View style={styles.strengthIndicator}>
                    <View
                      style={[
                        styles.strengthBar,
                        { backgroundColor: getPasswordStrengthColor() }
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.passwordFeedbackText,
                      { color: getPasswordStrengthColor() }
                    ]}
                  >
                    {passwordFeedback}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  !passwordMatch && confirmPassword ? styles.inputError : null
                ]}
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {!passwordMatch && confirmPassword && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flexGrow: 1,
    padding: 20
  },
  backButton: {
    padding: 10,
    marginLeft: -10
  },
  header: {
    marginTop: 10,
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  form: {
    flex: 1
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  formGroup: {
    flex: 1,
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  inputError: {
    borderColor: '#EF4444' // red
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16
  },
  eyeIcon: {
    padding: 12
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  buttonDisabled: {
    backgroundColor: '#a5a5a5'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5
  },
  loginLink: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600'
  },
  // Password strength styles
  passwordFeedbackContainer: {
    marginTop: 8
  },
  strengthIndicator: {
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 6
  },
  strengthBar: {
    height: '100%',
    width: '100%',
    borderRadius: 2
  },
  passwordFeedbackText: {
    fontSize: 12
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

export default OwnerSignupScreen;
