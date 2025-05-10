import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { logoutUser } from '../cookiesApi';
 import  CookieManager  from '@react-native-cookies/cookies';
 import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');



  const handleLogin = async () => {
    try {
      await CookieManager.clearAll(); // 🔑 Ensures session is clean
  
      const tokenRes = await fetch('https://neet.crudpixel.tech/session/token');
      const csrfToken = await tokenRes.text();
     // console.log('CSRF Token:', csrfToken);

      // Login next
      const loginRes = await fetch('https://neet.crudpixel.tech/user/login?_format=json', {
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
        navigation.navigate('Subjects');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
  error: { color: 'red' }
});
