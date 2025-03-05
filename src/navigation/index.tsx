import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import SitterNavigator from './SitterNavigator';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const { user, profile, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // User is not signed in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : // User is signed in, determine which navigator to use based on user type
        profile?.user_type === 'owner' ? (
          <Stack.Screen name="OwnerRoot" component={OwnerNavigator} />
        ) : (
          <Stack.Screen name="SitterRoot" component={SitterNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
