import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Validation', 'Please enter your email address');
      return;
    }

    try {
      const response = await fetch('https://studyneet.crudpixel.tech/jsonapi/user/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          data: {
            type: 'user--password-reset',
            attributes: { mail: email }
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'A password reset link has been sent to your email.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.errors?.[0]?.detail || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../asstes/login1.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '70%',
    height: 220,
    marginBottom: 30
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: '#0063e5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  backText: {
    color: '#0063e5',
    marginTop: 20,
    fontSize: 16
  }
});
