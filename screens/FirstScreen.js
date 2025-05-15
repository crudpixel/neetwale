import React,{useLayoutEffect} from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import IntroCarousel from './IntroCarousel';


const FirstScreen = ({ navigation }) => {
useLayoutEffect(() => {
  navigation.setOptions({
    headerBackVisible: false, // Hides back arrow in v6+
  });
}, [navigation]);



  return (
    <View style={styles.firstContainer}>
      <IntroCarousel/>
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
   
  }
})