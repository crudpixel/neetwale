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
import SubjectRecommendations from './screens/SubjctRecommendations';
import PayNowScreen from './screens/PayNowScreen';
import FacultyDashboard from './screens/FacultyDashboard';
import CreateLiveSession from './screens/CreateLiveSession';
import FacultyTabs from './screens/FacultyTab';
import EditSessionForm from './screens/EditSessionForm';
import NotificationScreen from './screens/NotificationScreen';
import AllSessions from './screens/AllSession';



const Stack = createNativeStackNavigator();

export default function App() {

 
  const [initialRoute, setInitialRoute] = useState(null);

useEffect(() => {
  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (!userData) {
        // User not logged in
        setInitialRoute('Home');
        return;
      }

      const userObj = JSON.parse(userData);
      console.log(userObj)
      const userDetailsRes = await fetch(
        `https://studyneet.crudpixel.tech/api/user/${userObj.userid}/roles`
      );

      if (!userDetailsRes.ok) {
        throw new Error('Failed to fetch user roles');
      }

      const userDetails = await userDetailsRes.json();

      const facultyRoles = [
        'physics_faculty',
        'chemistry_faculty',
        'biology_faculty',
      ];

      const isFaculty = userDetails.roles?.some(role =>
        facultyRoles.includes(role)
      );

      if (isFaculty) {
        setInitialRoute('FacultyDashboard');
      } else {
        setInitialRoute('Dashboard');
      }

    } catch (error) {
      console.error('Error checking user:', error);
      Alert.alert('Error', 'Something went wrong. Redirecting to login.');
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
        <Stack.Screen name="Question-sets" component={SetsScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
         {/* <Stack.Screen name="MainDrawer" component={DrawerNavigator} /> */}
        <Stack.Screen name="Dashboard" component={BottomTabNavigator} options={{ headerShown: true ,}}   />
        <Stack.Screen name="Home" component={FirstScreen} options={{ headerShown: false }} />
        <Stack.Screen name="test" component={MyTestsScreen} />
        <Stack.Screen name="review" component={ReviewScreen} />
        <Stack.Screen name="studymaterial" component={StudyMaterial} />
        <Stack.Screen name="PDFScreen" component={PDFScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChapterList" component={ChapterList} />
        <Stack.Screen name="Recommendation" component={SubjectRecommendations} />
        <Stack.Screen name="PayNow" component={PayNowScreen} />
        <Stack.Screen name="FacultyDashboard" component={FacultyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CreateLiveSession" component={CreateLiveSession} options={{ title: 'Create Live Session' }}/>
        <Stack.Screen name="EditSessionForm" component={EditSessionForm} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="AllSession" component={AllSessions} />
        

      </Stack.Navigator>
    </NavigationContainer>

  
  );
}