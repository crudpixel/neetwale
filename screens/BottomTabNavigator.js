import React, { useLayoutEffect, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SubjectsScreen from './SubjectsScreen';
import ProfileScreen from './ProfileScreen';
import DashboardScreen from './DashboardScreen';
import StudyMaterial from './StudyMaterial';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import StudentAskQuery from './StudentAskQuery';
import ForumScreen from './ForumScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user?.name || 'User');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') iconName = 'house';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Study Material') iconName = 'picture-as-pdf';
          else if (route.name === 'Test Series') iconName = 'book';
          else if (route.name === 'Forum') iconName = 'chat';


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
          fontSize: 20,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: `Hello, ${username}`,
          headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={{ marginRight: 15 }}
          >
            <MaterialIcons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        ),
        }}
      />
      <Tab.Screen name="Study Material" component={StudyMaterial} />      
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Test Series" component={SubjectsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
