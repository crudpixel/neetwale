import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyTestsScreen({ route, navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const solved_id = route?.Params || ''; // fallback

  useEffect(() => {
    const fetchTests = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const userId = user?.userid;

      if (!userId) return;

      try {
        const res = await fetch(
          `https://studyneet.crudpixel.tech/api/student-result?user_id=${userId}${solved_id}`
        );
        const json = await res.json();

        const allResults = json.data || [];
        const userResults = allResults
          .filter((t) => t.user_id == userId)
          .map((item) => ({
            ...item,
            leaderboard: [
              { name: 'Vikash', score: 85 },
              { name: 'Anjali', score: 82 },
              { name: 'Ravi', score: 78 },
              { name: 'Meena', score: 75 },
              { name: 'Karan', score: 70 },
            ],
          }));

        setTests(userResults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 My Submitted Tests</Text>

      <FlatList
        data={tests}
        keyExtractor={(item) => item.solved_id.toString()}
        renderItem={({ item }) => (
          <>
            {/* Test Info Card */}
            <View style={styles.testCard}>
              <Text style={styles.testTitle}>Test ID: {item.question_paper_id}</Text>

              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>Score</Text>
                <Text style={styles.scoreValue}>
                  {item.score} / {item.total_marks}
                </Text>
              </View>

              <Text style={styles.attemptedText}>Attempted: {item.attempted}</Text>

              <TouchableOpacity
                style={styles.testItem}
                onPress={() => navigation.navigate('review', { testData: item })}
              >
                <Text style={styles.reviewBtn}>Review Your Test</Text>
              </TouchableOpacity>
            </View>

            {/* Leaderboard Card */}
            <View style={styles.leaderboardCard}>
              <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
              {(item.leaderboard || []).slice(0, 5).map((entry, index) => (
                <View key={index} style={styles.leaderboardRow}>
                  <Text style={styles.leaderboardRank}>{index + 1}.</Text>
                  <Text style={styles.leaderboardName}>{entry.name}</Text>
                  <Text style={styles.leaderboardScore}>{entry.score}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  testTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  scoreBox: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    color: '#444',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0063e5',
    marginTop: 5,
  },
  attemptedText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  testItem: {
    padding: 15,
    backgroundColor: '#0063e5',
    borderRadius: 8,
    marginTop: 10,
  },
  reviewBtn: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  leaderboardCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
