import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopicStatsTable = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <View style={styles.tableCard}>
      <Text style={styles.leaderboardTitle}>📊 Topic-wise Performance</Text>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.headerCell]}>Topic</Text>
        <Text style={[styles.cell, styles.headerCell]}>Correct</Text>
        <Text style={[styles.cell, styles.headerCell]}>Wrong</Text>
        <Text style={[styles.cell, styles.headerCell]}>Percentage</Text>
      </View>
      {stats.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{item.topic}</Text>
          <Text style={styles.cell}>{item.correct}</Text>
          <Text style={styles.cell}>{item.wrong}</Text>
          <Text style={styles.cell}>{item.percentage}%</Text>
        </View>
      ))}
    </View>
  );
};

export default function MyTestsScreen({ route, navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const solved_id = route?.Params || '';
  const questionLength = route?.Params;
  const topicStats = route?.params?.topicStats || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
    });
  }, [navigation]);


useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      navigation.navigate('Dashboard');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove(); // ✅ correct way to clean up
  }, [navigation])
);




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

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 🧠My Submitted Tests</Text>

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

              <Button
                title="Go to Dashboard"
                onPress={() => navigation.navigate('Dashboard', { questionLength })}
              />
            </View>

            {/* Topic Stats Table */}
            <TopicStatsTable stats={topicStats} />

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
    backgroundColor: '#f8f9fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  testCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  testTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#2c3e50',
    marginBottom: 10,
  },
  scoreBox: {
    backgroundColor: '#e8f0fe',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreText: {
    fontSize: 15,
    color: '#5c6b73',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0063e5',
    marginTop: 5,
  },
  attemptedText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  testItem: {
    padding: 14,
    backgroundColor: '#0063e5',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  reviewBtn: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  leaderboardCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34495e',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#f0f4f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  leaderboardRank: {
    width: 30,
    fontWeight: '700',
    color: '#333',
  },
  leaderboardName: {
    flex: 1,
    fontWeight: '500',
    color: '#444',
  },
  leaderboardScore: {
    fontWeight: '700',
    color: '#27ae60',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Topic Stats Table Styles
  tableCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: '#2c3e50',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: 14,
  },
});
