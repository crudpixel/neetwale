import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { logoutUser } from '../cookiesApi';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');



  const handleLogin = async () => {
    try {
      await CookieManager.clearAll(); // 🔑 Ensures session is clean

      const tokenRes = await fetch('https://studyneet.crudpixel.tech/session/token');
      const csrfToken = await tokenRes.text();
      // console.log('CSRF Token:', csrfToken);

      // Login next
      const loginRes = await fetch('https://studyneet.crudpixel.tech/user/login?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: username,
          pass: password,
        }),
      });

      const data = await loginRes.json();



      if (loginRes.ok) {

        console.log('Login success:', data.current_user.uid);
        await AsyncStorage.setItem('user', JSON.stringify({
          userid: data.current_user.uid,
          name: username,
        }));

        //  const storedUser = await AsyncStorage.getItem('user');
        // console.log('Stored user:', storedUser);
        Alert.alert(`${username} you Login SuccessFully.`)
        navigation.navigate('Dashboard');
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
      <Image source={require('../asstes/Login.jpg')} style={styles.image} resizeMode="contain" />

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
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, padding: 20, backgroundColor: "white" },
  input: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
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
    width: '100%',
    height: 400,

  },
  signUpText: {
    color: "#0063e5",
    fontWeight: 600
  },
  button1:{
  backgroundColor:"#0063e5",
  padding:15,
  borderRadius:10,
  marginTop:5,
  },
  buttonText1:{
     color:"white",
    textAlign:"center",
    fontSize:16,
    fontWeight:400
    
  }
});
