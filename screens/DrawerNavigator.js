import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SubjectsScreen from './SubjectsScreen';
import MyTestsScreen from './MyTest';
import ReviewScreen from './ReviewScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Subjects">
      <Drawer.Screen name="Subjects" component={SubjectsScreen} />
      <Drawer.Screen name="Review" component={ReviewScreen} />
      <Drawer.Screen name="My Tests" component={MyTestsScreen} />
    </Drawer.Navigator>
  );
}
