import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FacultyDashboard = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);


    const loadUserAndSessions = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          setUserName(userObj.name);
          navigation.setOptions({ title: `Hello ${userObj.name}`, tabBarLabel: 'Dashboard' });

          const res = await fetch(
            `https://studyneet.crudpixel.tech/api/faculty-live-sessions?author_id=${userObj.name}`
          );
          const json = await res.json();
          if (json.status === 'success') {
            setSessions(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

   useFocusEffect(
  useCallback(() => {
    loadUserAndSessions();
  }, [])
);


  const scheduledSessions = sessions.filter(
    session => session.field_status?.toLowerCase() === 'scheduled'
  );
  const completedSessions = sessions.filter(
    session => session.field_status?.toLowerCase() === 'completed'
  );

const handleDelete = (nid) => {
  Alert.alert('Delete Session', 'Are you sure you want to delete this session?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          const response = await fetch(`https://studyneet.crudpixel.tech/api/faculty-live-session/delete?nid=${nid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nid: String(nid) }),
          });

          const result = await response.json();

          if (result.status === 'success') {
            Alert.alert('Success', 'Session deleted successfully');
            setSessions(prev => prev.filter(session => session.nid !== nid));
          } else {
            Alert.alert('Error', result.message || 'Failed to delete session');
          }
        } catch (error) {
          console.error('Delete error:', error);
          Alert.alert('Error', 'Something went wrong while deleting the session');
        }
      },
    },
  ]);
};


  const renderSessionCard = (session) => (
    <View key={session.nid} style={styles.card}>
      <Text style={styles.cardTitle}>{session.title}</Text>
      <Text>Fees: ₹{session.field_fees}</Text>
      <Text>Date: {session.field_session_date}</Text>
      <Text>Status: {session.field_status || 'N/A'}</Text>

      <View style={styles.buttonRow}>
<TouchableOpacity
  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
  onPress={() =>
    navigation.navigate('EditSessionForm', {
      nid: session.nid,
      title: session.title,
      field_fees: session.field_fees,
      field_session_date: session.field_session_date,
      field_status: session.field_status,
    })
  }
>
  <Text style={styles.buttonText}>Edit</Text>
</TouchableOpacity>


        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' }]}
          onPress={() => handleDelete(session.nid)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateLiveSession')}
      >
        <Text style={styles.buttonText}>Create Live Session</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3949AB" />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
          {scheduledSessions.length > 0 ? (
            scheduledSessions.map(renderSessionCard)
          ) : (
            <Text style={styles.emptyText}>No scheduled sessions.</Text>
          )}

          <Text style={styles.sectionTitle}>Completed Sessions</Text>
          {completedSessions.length > 0 ? (
            completedSessions.map(renderSessionCard)
          ) : (
            <Text style={styles.emptyText}>No completed sessions.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  createButton: {
    backgroundColor: '#3949AB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default FacultyDashboard;
