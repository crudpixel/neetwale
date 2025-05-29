import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { logoutUser } from '../cookiesApi';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FacultyDashboard from './FacultyDashboard';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');



  const handleLogin = async () => {
    try {
       await CookieManager.clearAll(); // 🔑 Ensures session is clean
      // Login next
      const loginRes = await fetch('https://studyneet.crudpixel.tech/user/login?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: username,
          pass: password,
        }),
      });

      const data = await loginRes.json();


      if (loginRes.ok) {

      //  console.log('Login success:', data.current_user.uid,data.current_user.name);
await AsyncStorage.setItem('user', JSON.stringify({
  userid: data.current_user.uid,
  name: username,
  csrf_token: data.csrf_token,
  logout_token: data.logout_token,
  access_token: data.access_token
}));


         const userData = await AsyncStorage.getItem('user');
         const userObj = JSON.parse(userData);
         console.log(userObj)
 
         const userDetailsRes = await fetch(
          `https://studyneet.crudpixel.tech/api/user/${data.current_user.uid}/roles`
        );
        const userDetails = await userDetailsRes.json();

        console.log("dfdfdfd",userDetails)

        Alert.alert(`${username} you Login Successfully.`)
const isFaculty = userDetails.roles.includes('physics_faculty') ||
                  userDetails.roles.includes('chemistry_faculty') ||
                  userDetails.roles.includes('biology_faculty');

if (isFaculty) {
  navigation.navigate('FacultyDashboard');
} else {
  navigation.navigate('Dashboard');
}

       
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    }
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <Image source={require('../asstes/login1.png')} style={styles.image} resizeMode="contain" />
     <View style={styles.form}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* <Button title="Login" onPress={handleLogin} /> */}
       <TouchableOpacity style={styles.button1} onPress={handleLogin}><Text style={styles.buttonText1}>Login</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>
          Don't have an account?{' '}
          <Text style={styles.signUpText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
        <Text style={styles.signUpText1}>Forgot Password?</Text>

      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, padding: 10, backgroundColor: "white" },
  input: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16
  },
  error: { color: 'red' },
  buttonText: {
    textAlign: "center",
    margin: 10,
    color: "black",
    fontSize: 16,
    fontWeight: 400,
  },
  image: {
    width: '60%',
    height: 350,
    marginTop:200,
    margin:'auto'


  },
  signUpText: {
    color: "#0063e5",
    fontWeight: 600,
    textAlign:"center",
    fontSize:16,
  },
  signUpText1: {
    color: "#0063e5",
    fontWeight: 600,
    textAlign:"center",
    fontSize:16,
   
  },
  button1:{
  backgroundColor:"#0063e5",
  padding:15,
  borderRadius:5,
  marginTop:5,
  marginBottom:8,
   
  },

  buttonText1:{
     color:"white",
    textAlign:"center",
    fontSize:16,
    fontWeight:400
    
  },
  form:{
    marginBottom:200
  }
});
