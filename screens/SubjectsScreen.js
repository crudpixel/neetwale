import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { logoutUser } from '../cookiesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
const subjects = ['Physics', 'Chemistry', 'Biology'];

export default  function SubjectsScreen({ navigation }) {

  const handleLogout=async()=>{
    await AsyncStorage.removeItem('user');
    navigation.navigate('Home')
  }
  
      

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select The Subject for Real Time Test.</Text>
      <Button title="Review" onPress={()=>navigation.navigate("test")}/>
      {/* <Button title="Login" onPress={() => navigation.navigate('Login')} /> */}
      <Button title="Logout" onPress={handleLogout} />
      {subjects.map((subject, index) => (
        <TouchableOpacity
          key={subject}
          style={styles.card}
          onPress={() => navigation.navigate('Sets', { subject })}
        >
          <Text style={styles.cardText}>{subject}</Text>
        </TouchableOpacity>
        
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  heading:{
  fontSize:20,
  textAlign:"center",
  marginBottom:20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '47%',
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
