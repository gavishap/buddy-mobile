import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OwnerSignupScreen from '../screens/auth/OwnerSignupScreen';
import SitterSignupScreen from '../screens/auth/SitterSignupScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

// Define the authentication stack navigation param list
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OwnerSignup: undefined;
  SitterSignup: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OwnerSignup" component={OwnerSignupScreen} />
      <Stack.Screen name="SitterSignup" component={SitterSignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
