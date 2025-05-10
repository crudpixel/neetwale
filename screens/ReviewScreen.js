import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';

export default function ReviewScreen({ route, navigation }) {
  const { testData } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const studentAnswers = JSON.parse(testData.answer);
  console.log(testData)
  useEffect(() => {
    // Fetch the actual questions from backend based on question_paper_id
    fetch(`https://neet.crudpixel.tech/jsonapi/node/question?filter[field_subject_set.name]=${encodeURIComponent(testData.question_paper_id)}`)
      .then(res => res.json())
      .then(data => {
        const optionLabels = ['A', 'B', 'C', 'D'];
        const formatted = data.data.map((q, idx) => {
          const correctIndex = optionLabels.indexOf(q.attributes.field_correct_answer);
          return {
            title: q.attributes.title,
            options: q.attributes.field_options,
            correct: q.attributes.field_options[correctIndex],
            explanation: q.attributes.field_answer_explanation?.processed || '',
            qKey: `Q${idx + 1}`
          };
        });

        setQuestions(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading questions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = studentAnswers[currentQuestion.qKey];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviewing: {testData.question_paper_id}</Text>

      <Text style={styles.questionText}>{currentIndex + 1}. {currentQuestion.title}</Text>

      {currentQuestion.options.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        return (
          <View
            key={idx}
            style={[
              styles.option,
              isSelected ? styles.selectedOption : styles.defaultOption
            ]}
          >
            <Text>{option}</Text>
          </View>
        );
      })}

      <Text style={styles.correctAnswer}>✅ Correct Answer: {currentQuestion.correct}</Text>
      {currentQuestion.explanation ? (
  <Text style={styles.explanationText}>💡 Explanation: {currentQuestion.explanation.replace(/<[^>]+>/g, '')}</Text>
) : null}
  

      <View style={styles.navigationButtons}>
        {currentIndex > 0 && (
          <Button title="Previous" onPress={() => setCurrentIndex(prev => prev - 1)} />
        )}
        {currentIndex < questions.length - 1 && (
          <Button title="Next" onPress={() => setCurrentIndex(prev => prev + 1)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  questionText: { fontSize: 16, marginBottom: 15 },
  option: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: 'blue',
    backgroundColor: '#dbeafe'
  },
  defaultOption: {
    borderColor: '#ccc',
  },
  correctAnswer: {
    marginTop: 15,
    fontStyle: 'italic',
    color: 'green'
  },
  explanationText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
    fontStyle: 'italic'
  },
  navigationButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
