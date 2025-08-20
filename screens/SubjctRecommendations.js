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

const knownSubjects = ["Physics", "Chemistry", "Biology", "Previous Year", "Mock"];

export default function SubjectRecommendations({ route }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topicStats, setTopicStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialSubject = async () => {
      const initialSubject = route?.params?.subject;
      if (initialSubject) {
        handleSubjectPress(initialSubject);
      }
    };
    loadInitialSubject();
  }, []);

  const handleSubjectPress = async (subject) => {
    if (subject === selectedSubject && topicStats.length > 0) return;

    setSelectedSubject(subject);
    setLoading(true);
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const userId = user?.userid;
    console.log(userId,subject)

    try {
      const response = await fetch(
        `https://studyneet.crudpixel.tech/api/get-recommendations?user_id=${userId}&subject=${subject}`
      );
      const result = await response.json();
      const rawTopics = result?.data || [];

      const formattedTopics = rawTopics.filter(item => {
    const topic = item.recommendation_topic?.topic;
    return topic !== 'Unknown Topic' && !(Array.isArray(topic) && topic.length === 0);
  }).map(item => {
        const correct = Number(item.recommendation_topic?.correct || 0);
        const wrong = Number(item.recommendation_topic?.wrong || 0);
        const total = correct + wrong;
        const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : '0.00';

        return {
          topic: item.recommendation_topic?.topic || 'Unknown',
          correct,
          wrong,
          percentage,
          status: item.status || 'pending',
        };
      });


      formattedTopics.sort((a, b) => b.wrong - a.wrong);
      setTopicStats(formattedTopics);
    } catch (error) {
      console.error(`Error fetching ${subject} data:`, error);
      setTopicStats([]);
    }

    setLoading(false);
  };

  const markTopicCompleted = async (topicName) => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const userId = user?.userid;

    const topicToUpdate = topicStats.find(topic => topic.topic === topicName);
    if (!topicToUpdate) return;

    try {
      const res = await fetch('https://studyneet.crudpixel.tech/api/submit-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          subject: selectedSubject,
          recommendation_topic: {
            topic: topicToUpdate.topic,
            correct: topicToUpdate.correct,
            wrong: topicToUpdate.wrong
          },
          status: "completed"
        }),
      });

      const result = await res.json();
      if (result.status === "success") {
        const updatedTopics = topicStats.map(topic =>
          topic.topic === topicName ? { ...topic, status: 'completed' } : topic
        );
        setTopicStats(updatedTopics);
      } else {
        Alert.alert("Error", "Failed to update topic status.");
      }
    } catch (error) {
      console.error("API error:", error);
      Alert.alert("Error", "Something went wrong while updating.");
    }
  };

  const confirmMarkCompleted = (topicName) => {
    Alert.alert(
      "Mark Completed",
      `Are you sure you've completed "${topicName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => markTopicCompleted(topicName) },
      ]
    );
  };

  const pendingTopics = topicStats.filter(t => t.status !== 'completed');
  const completedTopics = topicStats.filter(t => t.status === 'completed');

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
          <Text style={styles.subjectTitle}>{selectedSubject}</Text>

          {/* 🕓 Pending Topics */}
          <Text style={styles.sectionTitle}>⏳ Pending </Text>
          {pendingTopics.map((topic, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Correct:</Text>
                <Text>{topic.correct}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Wrong:</Text>
                <Text>{topic.wrong}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Percentage:</Text>
                <Text>{topic.percentage}%</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Status:</Text>
                <TouchableOpacity onPress={() => confirmMarkCompleted(topic.topic)}>
                  <Text style={{ color: 'blue' }}>Mark Completed</Text>
                </TouchableOpacity>
              </View>
            </View>

          ))}

          {/* ✅ Completed Topics */}
          <Text style={styles.sectionTitle}>✅ Completed </Text>
          {completedTopics.map((topic, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Correct:</Text>
                <Text>{topic.correct}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Wrong:</Text>
                <Text>{topic.wrong}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Percentage:</Text>
                <Text>{topic.percentage}%</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Status:</Text>
                <Text style={{ color: 'green' }}>✔ Completed</Text>

              </View>
            </View>

          ))}
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
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#636e72',
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  topicTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  cardLabel: {
    fontWeight: '600',
    color: '#636e72',
  },

});
