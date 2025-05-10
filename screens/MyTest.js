import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyTestsScreen({ navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const userId = user?.userid;
      //const solvedId = user?.solved_id;
      //console.log(userId,solvedId)
      if (!userId) return;

      try {
        const res = await fetch(`https://neet.crudpixel.tech/api/student-result?user_id=${userId}`);
        const json = await res.json();

        const allResults = json.data || [];

        // Optional: Filter by userId just to be safe
        const userResults = allResults.filter(t => t.user_id == userId);

        setTests(userResults);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setLoading(false);
      }
    };


    fetchTests();
  }, []);

  console.log(tests)

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 My Submitted Tests</Text>

      <FlatList
        data={tests}
        keyExtractor={item => item.solved_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testItem}
            onPress={() => navigation.navigate('review', { testData: item })}
          >
            <Text style={styles.testTitle}>{item.question_paper_id}</Text>
            <Text>Score: {item.score} / {item.total_marks}</Text>
            <Text>Attempted: {item.attempted}</Text>
          </TouchableOpacity>
        )}


      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  testItem: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
  },
  testTitle: { fontWeight: 'bold', fontSize: 18 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
