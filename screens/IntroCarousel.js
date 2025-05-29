import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');


const IntroCarousel = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <ImageBackground
       source={require('../asstes/neet2.png')}
      style={styles.background}
       resizeMode="cover"
    >
      <View style={styles.overlay}>
            <View style={styles.slide}>
               <Image source={require('../asstes/Intro.png')} style={styles.image} resizeMode="contain" />
              {/* <Text style={styles.title}>{item.title}</Text> */}
            </View>
   
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
  },

  button: {
    backgroundColor: '#0063e5',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 300,
    elevation: 3,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
    background: {
    flex: 1,
    width: '100%',
    height: '100%',
    //backgroundColor:"white"
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
  },

  image:{
   width:'100%',
    marginTop:80,
  }

});

export default IntroCarousel;
