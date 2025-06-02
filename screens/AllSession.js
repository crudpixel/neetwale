import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function AllSessions({ navigation }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('https://studyneet.crudpixel.tech/api/faculty-live-sessions?field_status=Scheduled');
        const json = await response.json();
        if (json.status === 'success') {
          setSessions(json.data);
        }
      } catch (error) {
        console.error('Error fetching all sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  const handleBooking = (item) => {
    navigation.navigate('PayNow', {
      title: item.title,
      fees: item.field_fees,
      meetingLink: item.field_meeting_link,
      author: item.author_name,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.detail}>Faculty: {item.author_name} Sir</Text>
      <Text style={styles.detail}>Date: {item.field_session_date}</Text>
      <Text style={styles.detail}>Price: ₹{item.field_fees}</Text>
      <Text style={styles.description}>{item.field_description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleBooking(item)}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>All Upcoming Live Sessions</Text>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f2f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#1e1e1e',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
