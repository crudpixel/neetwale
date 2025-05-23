import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const knownSubjects = ["Physics", "Chemistry", "Biology", "Previous Year Set", "Mock"];

export default function SubjectRecommendations() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topicStats, setTopicStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedTopics, setCompletedTopics] = useState({}); // { 'topic name': true }

  // Load completed topics from AsyncStorage
  useEffect(() => {
    const loadCompleted = async () => {
      const stored = await AsyncStorage.getItem('completedTopics');
      if (stored) {
        setCompletedTopics(JSON.parse(stored));
      }
    };
    loadCompleted();
  }, []);

  const saveCompleted = async (newCompleted) => {
    await AsyncStorage.setItem('completedTopics', JSON.stringify(newCompleted));
  };

  const handleSubjectPress = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const userId = user?.userid;

    try {
      const response = await fetch(
        `https://studyneet.crudpixel.tech/api/get-recommendations?user_id=${userId}&subject=${subject}`
      );
      const json = await response.json();

      // Merge all topic data by summing correct/wrong across responses
      const mergedTopics = {};
      json?.data?.forEach(entry => {
        entry.recommendation_topic.forEach(topic => {
          const key = topic.topic;
          if (!mergedTopics[key]) {
            mergedTopics[key] = { ...topic, correct: 0, wrong: 0 };
          }
          mergedTopics[key].correct += parseInt(topic.correct);
          mergedTopics[key].wrong += parseInt(topic.wrong);
        });
      });

      const mergedArray = Object.values(mergedTopics);
      mergedArray.sort((a, b) => b.wrong - a.wrong); // Sort by most wrongs

      setTopicStats(mergedArray);
    } catch (error) {
      console.error(`Error fetching ${subject} data:`, error);
      setTopicStats([]);
    }

    setLoading(false);
  };

  const handleMarkCompleted = (topicName) => {
    const updated = { ...completedTopics, [topicName]: true };
    setCompletedTopics(updated);
    saveCompleted(updated);
  };

  const confirmMarkCompleted = (topicName) => {
    Alert.alert(
      "Confirm Completion",
      `Have you really completed "${topicName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleMarkCompleted(topicName) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {!selectedSubject ? (
        <View>
          <Text style={styles.title}>📚 Select a Subject</Text>
          {knownSubjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subjectBtn}
              onPress={() => handleSubjectPress(subject)}
            >
              <Text style={styles.subjectText}>{subject}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" style={styles.centered} />
      ) : (
        <View>
          <TouchableOpacity onPress={() => setSelectedSubject(null)}>
            <Text style={styles.backBtn}>⬅ Back to Subjects</Text>
          </TouchableOpacity>
          <Text style={styles.subjectTitle}>{selectedSubject}</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.cellHeader}>Topic</Text>
            <Text style={styles.cellHeader}>Correct</Text>
            <Text style={styles.cellHeader}>Wrong</Text>
            <Text style={styles.cellHeader}>%</Text>
            <Text style={styles.cellHeader}>Status</Text>
          </View>
          {topicStats.map((topic, idx) => {
            const correct = topic.correct;
            const wrong = topic.wrong;
            const percent = ((correct / (correct + wrong || 1)) * 100).toFixed(2);
            const isCompleted = completedTopics[topic.topic];

            return (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.cell}>{topic.topic}</Text>
                <Text style={styles.cell}>{correct}</Text>
                <Text style={styles.cell}>{wrong}</Text>
                <Text style={styles.cell}>{percent}%</Text>
                {isCompleted ? (
                  <Text style={[styles.cell, { color: 'green' }]}>✔ Completed</Text>
                ) : (
                  <TouchableOpacity onPress={() => confirmMarkCompleted(topic.topic)}>
                    <Text style={[styles.cell, { color: 'blue' }]}>Mark Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f9fc' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d3436',
    textAlign: 'center',
  },
  subjectBtn: {
    backgroundColor: '#0984e3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  subjectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: {
    color: '#0984e3',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dfe6e9',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottomColor: '#ecf0f1',
    borderBottomWidth: 1,
  },
  cellHeader: {
    flex: 1,
    fontWeight: '700',
    color: '#2d3436',
    fontSize: 13,
  },
  cell: {
    flex: 1,
    color: '#2f3640',
    fontSize: 13,
  },
});
