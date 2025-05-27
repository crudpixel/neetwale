import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { logoutUser } from '../cookiesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const subjects = ['Physics', 'Chemistry', 'Biology', 'Previous Year Paper', 'All Subject (Mock Test)'];
const subjectsIcon = [
  require('../asstes/physics.png'),
  require('../asstes/chemistry.png'),
  require('../asstes/molecular.png'),
  require('../asstes/test.png'),
  require('../asstes/exam-time.png'),
];

export default function SubjectsScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    logoutUser();
    navigation.navigate('Home');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {subjects.map((subject, index) => (
        <TouchableOpacity
          key={subject}
          style={styles.card}
          onPress={() => navigation.navigate('Question-sets', { subject })}
        >
          <View style={styles.cardContent}>
            <Image source={subjectsIcon[index]} style={styles.icon} />
            <Text style={styles.cardText}>{subject}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
