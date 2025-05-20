import React ,{useEffect,useState} from 'react';
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
import BottomTabNavigator from './screens/BottomTabNavigator';
import StudyMaterial from './screens/StudyMaterial';
import PDFScreen from './screens/PDFScreen';
import ChapterList from './screens/ChapterList';


const Stack = createNativeStackNavigator();

export default function App() {

 
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setInitialRoute('Dashboard');
      } else {
        setInitialRoute('Home');
      }
    };
    checkUser();
  }, []);

  // Avoid rendering until the route is decided
  if (!initialRoute) return null;


  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="TestSeries" component={SubjectsScreen} />
        <Stack.Screen name="Sets" component={SetsScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
         {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} /> */}
        <Stack.Screen name="Dashboard" component={BottomTabNavigator} options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={FirstScreen} />
        <Stack.Screen name="test" component={MyTestsScreen} />
        <Stack.Screen name="review" component={ReviewScreen} />
        <Stack.Screen name="studymaterial" component={StudyMaterial} />
        <Stack.Screen name="PDFScreen" component={PDFScreen} />
        <Stack.Screen name="ChapterList" component={ChapterList} />
        

      </Stack.Navigator>
    </NavigationContainer>

  
  );
}