import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import OwnerDashboardScreen from '../screens/owner/DashboardScreen';
import OwnerProfileScreen from '../screens/owner/ProfileScreen';
import FindSittersScreen from '../screens/owner/FindSittersScreen';
import SitterProfileScreen from '../screens/owner/SitterProfileScreen';
import CreatePetProfileScreen from '../screens/owner/CreatePetProfileScreen';
import PetProfileScreen from '../screens/owner/PetProfileScreen';
import BookingDetailScreen from '../screens/owner/BookingDetailScreen';
import ApplicationsScreen from '../screens/owner/ApplicationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
    <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
    <Stack.Screen name="Applications" component={ApplicationsScreen} />
  </Stack.Navigator>
);

const FindSittersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FindSitters" component={FindSittersScreen} />
    <Stack.Screen name="SitterProfile" component={SitterProfileScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OwnerProfile" component={OwnerProfileScreen} />
    <Stack.Screen name="CreatePetProfile" component={CreatePetProfileScreen} />
    <Stack.Screen name="PetProfile" component={PetProfileScreen} />
  </Stack.Navigator>
);

const OwnerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'FindSitters') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="FindSitters" component={FindSittersStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default OwnerNavigator;
