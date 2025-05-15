// IntroCarousel.js

import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to Study with Neetwala',
    image: require('../asstes/intro11.jpg'),
  },
  {
    key: '2',
    title: 'Track Your Progress',
    image: require('../asstes/intro2.jpg'),
  },
  {
    key: '3',
    title: 'Achieve Your Goals',
    image: require('../asstes/intro3.jpg'),
  },
];

const IntroCarousel = () => {
    const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>
          {currentIndex === slides.length - 1 && (
  <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('Login')}>
    <Text style={styles.buttonText}>Get Started</Text>
  </TouchableOpacity>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight:500,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#aaa',
    margin: 5,
  },
  dotActive: {
    backgroundColor: '#000',
    width: 12,
    height: 12,
  },
    button: {
  backgroundColor: '#0063e5',
  padding:15,
  borderRadius: 6,
  alignSelf: 'center',
  marginBottom: 60,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '400',
},

});

export default IntroCarousel;
