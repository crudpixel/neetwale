import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';


const FirstScreen = ({ navigation }) => {
  return (
    <View style={styles.firstContainer}>
      <Text style={styles.h1}>Study With Neetwala  👋</Text>
      <View style={{ marginTop: 10, }}>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({

  h1: {
    fontSize: 24,
    fontWeight: 700,
  },

  firstContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow"
  }
})