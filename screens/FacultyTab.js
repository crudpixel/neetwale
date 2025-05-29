// screens/FacultyTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FacultyDashboard from './FacultyDashboard';
import CreateLiveSession from './CreateLiveSession';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function FacultyTabs() {


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'FacultyDashboard') iconName = 'dashboard';
          else if (route.name === 'LiveSession') iconName = 'live-tv';
          else if (route.name === 'Profile') iconName = 'person';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#3949AB',
          borderTopWidth: 0,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3949AB',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      })}
    >
      <Tab.Screen name="FacultyDashboard" component={FacultyDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="LiveSession" component={CreateLiveSession} options={{ title: 'Live Session' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
