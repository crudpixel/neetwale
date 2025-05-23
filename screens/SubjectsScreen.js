import React ,{useLayoutEffect}from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { logoutUser } from '../cookiesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
const subjects = ['Physics', 'Chemistry', 'Biology','Previous Year Paper','All Subject (Mock Test)'];

export default function SubjectsScreen({ navigation }) {
const subjectsIcon = ['🧲', '⚗️', '🧬', '📝', '🩺'];
  const handleLogout = async () => {
    
    await AsyncStorage.removeItem('user');
    logoutUser();
    navigation.navigate('Home')
  }

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
          <Text style={styles.cardText}>{subjectsIcon[index]} {subject}</Text>
        </TouchableOpacity>

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    backgroundColor:'#e9edf0',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },

  card: {
     backgroundColor:'yellow',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
   
  },
});
