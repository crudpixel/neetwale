import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Image, TouchableOpacity, ScrollView, Text } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

const handleRegister = async () => {
  try {
    const response = await fetch('https://studyneet.crudpixel.tech/jsonapi/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'user--user',
          attributes: {
            name: name,
            mail: email,
            pass: pass
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorDetail = data.errors?.[0]?.detail || 'Registration failed.';
      Alert.alert('Error', errorDetail);
    } else {
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    }

  } catch (error) {
    Alert.alert('Error', error.message);
  }
};



  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Image source={require('../asstes/register.png')} style={styles.image} resizeMode="contain" />
        <TextInput placeholder="Username" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry style={styles.input} />
        <TouchableOpacity style={styles.button1} onPress={handleRegister}>
          <Text style={styles.buttonText1}>SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.buttonText}>
            Already have an account?{" "}
            <Text style={styles.signUpText}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "white", paddingTop: 60 },
  input: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16
  },
  image: {
    width: '60%',
    height: 350,
    alignSelf: 'center'
  },
  button1: {
    backgroundColor: "#0063e5",
    padding: 15,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText1: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400"
  },
  buttonText: {
    textAlign: "center",
    margin: 10,
    color: "black",
    fontSize: 16,
    fontWeight: "400",
  },
  signUpText: {
    color: "#0063e5",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
