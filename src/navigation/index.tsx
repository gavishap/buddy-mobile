import React, { useEffect } from 'react';
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

  const getUserType = () => {
    console.log('📝 Determining user type:');
    console.log('📝 User data:', JSON.stringify(user));
    console.log('📝 Profile data:', JSON.stringify(profile));

    // Check profile first, then user, then default to owner
    if (profile?.user_type) {
      console.log(`📝 Using user_type from profile: ${profile.user_type}`);
      return profile.user_type;
    } else if (user?.user_type) {
      console.log(`📝 Using user_type from user: ${user.user_type}`);
      return user.user_type;
    } else {
      console.log("📝 No user_type found, defaulting to 'owner'");
      return 'owner';
    }
  };

  useEffect(() => {
    if (user) {
      const userType = getUserType();
      console.log(`📝 Final determined user type: ${userType}`);
      console.log(
        `📝 Will display ${
          userType === 'owner' ? 'OwnerNavigator' : 'SitterNavigator'
        }`
      );
    }
  }, [user, profile]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : (
        <>
          {getUserType() === 'owner' ? <OwnerNavigator /> : <SitterNavigator />}
        </>
      )}
    </NavigationContainer>
  );
}
