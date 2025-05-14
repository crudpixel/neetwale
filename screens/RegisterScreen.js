import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');


  const handleRegister = async () => {

    const tokenRes = await fetch('https://studyneet.crudpixel.tech/session/token');
    const csrfToken = await tokenRes.text();

    fetch('https://studyneet.crudpixel.tech/jsonapi/user/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        data: {
          type: 'user--user',
          attributes: {
            name: name,
            mail: email,
            pass: pass,
          }
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          Alert.alert('Error', data.errors[0].detail);
        } else {
          Alert.alert('Success', 'Registration successful!');
          navigation.navigate('Login');
        }
      })
      .catch(err => Alert.alert('Error', err.message));
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5
  }
});
