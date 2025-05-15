import React ,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubjectsScreen from './screens/SubjectsScreen';
import SetsScreen from './screens/SetsScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FirstScreen from './screens/FirstScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewScreen from './screens/ReviewScreen';
import MyTestsScreen from './screens/MyTest';
import DrawerNavigator from './screens/DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function App() {

 

  const [initialRoute, setInitialRoute] = React.useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      console.log(userData);
      if (userData) {
        setInitialRoute('Subjects');
      }else{
         setInitialRoute('Home');
      }
      
    };
    checkUser();
  }, []);



  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Subjects" component={SubjectsScreen} />
        <Stack.Screen name="Sets" component={SetsScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
         {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} /> */}
        <Stack.Screen name="Home" component={FirstScreen} />
        <Stack.Screen name="test" component={MyTestsScreen} />
        <Stack.Screen name="review" component={ReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  
  );
}