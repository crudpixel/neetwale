import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../cookiesApi';

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState('Guest');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.name || 'Guest');
        setScore(user.score || 85); // use dummy score
      }

      // Dummy leaderboard
      setLeaderboard([
        { name: 'Vikash', score: 85 },
        { name: 'Anjali', score: 82 },
        { name: 'Ravi', score: 78 },
        { name: 'Meena', score: 75 },
        { name: 'Karan', score: 70 },
      ]);
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    logoutUser();
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar} />
        <Text style={styles.label}>Welcome,</Text>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.score}>Your Score: <Text style={styles.scoreValue}>{score}</Text></Text>
      </View>

      <View style={styles.leaderboardCard}>
        <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
        {leaderboard.map((entry, index) => (
          <View key={index} style={styles.leaderboardRow}>
            <Text style={styles.leaderboardRank}>{index + 1}.</Text>
            <Text style={styles.leaderboardName}>{entry.name}</Text>
            <Text style={styles.leaderboardScore}>{entry.score}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 40,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  leaderboardCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leaderboardRank: {
    width: 30,
    fontWeight: '600',
    color: '#666',
  },
  leaderboardName: {
    flex: 1,
    color: '#444',
  },
  leaderboardScore: {
    fontWeight: '600',
    color: '#007bff',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'tomato',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
