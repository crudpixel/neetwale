import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import SubjectsScreen from './SubjectsScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from './ProfileScreen';
import DashboardScreen from './DashboardScreen';
import StudyMaterial from './StudyMaterial';
// Dummy Screens



const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false, // Hides back arrow in v6+
        });
    }, [navigation]);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = 'house';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    } else if (route.name === 'Study Material') {
                        iconName = 'picture-as-pdf';
                    } else if (route.name === 'TestSeries') {
                        iconName = 'book';
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0063e5',
                tabBarInactiveTintColor: 'black',
                headerShown: true,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />

            <Tab.Screen  name="TestSeries" component={SubjectsScreen} />
            <Tab.Screen   name="Profile" component={ProfileScreen} />
            <Tab.Screen    name="Study Material" component={StudyMaterial} />
        </Tab.Navigator>
    );
}
