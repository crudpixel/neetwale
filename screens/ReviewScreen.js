import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const BASE_URL = 'https://studyneet.crudpixel.tech';

const fixImageUrls = (html) => {
  if (!html) return '';
  return html.replace(/<img\s+[^>]*src="(\/[^"]*)"/g, `<img src="${BASE_URL}$1"`);
};

export default function ReviewScreen({ route }) {
  const { testData } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const studentAnswers = JSON.parse(testData.answer);
  const { width } = useWindowDimensions();

  console.log("testdata",testData)


useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects?filter[name]=${encodeURIComponent(
          testData.question_paper_id
        )}&include=field_question,field_question.field_subject_topics`
      );
      const data = await response.json();

      const subject = data.data[0]; // Ensure subject exists
      if (!subject) {
        console.warn('Subject not found for this test');
        return;
      }

      const questions = subject.relationships.field_question.data || [];

      // Build a map of topic IDs to names from included
      const topicMap = {};
      data.included?.forEach((item) => {
        if (item.type === 'taxonomy_term--subject_topic') {
          topicMap[item.id] = item.attributes.name;
        }
      });

      // Prepare formatted question list
      const formatted = questions.map((qRef, idx) => {
        const question = data.included.find(
          (item) => item.id === qRef.id && item.type === 'node--question'
        );
        if (!question) return null;

        const options = question.attributes.field_option || [];
        const correctAnswer = question.attributes.field_correct_answer?.trim();
// const correctAnswer = question.attributes.field_correct_answer?.trim();

// Match numeric values like "3" or "(3)"
const correctIndex = (() => {
  const match = correctAnswer?.match(/\d+/); // extract number like 3
  if (match) return parseInt(match[0], 10) - 1;
  const optionLabels = ['A', 'B', 'C', 'D'];
  const alphaIndex = optionLabels.indexOf(correctAnswer);
  return alphaIndex;
})();

const correctOption =
  correctIndex !== -1 && options[correctIndex]
    ? options[correctIndex]
    : options.find(
        (opt) =>
          opt.trim().toLowerCase() === correctAnswer?.toLowerCase()
      ) || 'Not Available';


        // Handle topic
        const topicData = question.relationships?.field_subject_topics?.data;
        const topicId = Array.isArray(topicData) ? topicData[0]?.id : topicData?.id;
        const topicName = topicMap[topicId] || 'Unknown Topic';

        return {
          qKey: `Q${idx + 1}`,
          title: question.attributes.field_question?.value || '',
          options,
          correct: correctOption,
          topicName,
          explanation: question.attributes.field_answer_explanation?.processed || '',
        };
      }).filter(Boolean);

      setQuestions(formatted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching review questions:', error);
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);



  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

 const currentQuestion = questions[currentIndex] || null;
const selectedAnswer = currentQuestion ? studentAnswers[currentQuestion.qKey] : null;


  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>
            Reviewing: {testData.question_paper_id}
          </Text>

          <View style={{ marginBottom: 10 }}>
            <RenderHTML
              contentWidth={width}
              tagsStyles={{
                p: { fontSize: 18, color: 'black', marginBottom: 10 },
                img: {
                  maxWidth: 300,
                  height: 300,
                  display: 'flex',
                  resizeMode: 'contain',
                },
              }}
              source={{ html: fixImageUrls(currentQuestion.title) }}
            />
          </View>

          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correct;
            const isWrong = isSelected && !isCorrect;

            return (
              <View
                key={idx}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                  isCorrect && {
                    borderColor: 'green',
                    backgroundColor: '#e6ffed',
                  },
                  isWrong && {
                    borderColor: 'red',
                    backgroundColor: '#ffe6e6',
                  },
                ]}
              >
                <Text>{option}</Text>
              </View>
            );
          })}

          <Text style={styles.correctAnswer}>
            ✅ Correct Answer: {currentQuestion.correct}
          </Text>
          <Text style={styles.topicText}>
            📚 Topic: {currentQuestion.topicName}
          </Text>

          {currentQuestion.explanation ? (
            <RenderHTML
              contentWidth={width}
              tagsStyles={{
                p: { fontSize: 16, color: 'black', margin: 10 },
                ul: { paddingLeft: 20 },
                li: { fontSize: 16, marginBottom: 10 },
                img: {
                  maxWidth: 300,
                  height: 300,
                  display: 'flex',
                  resizeMode: 'contain',
                },
              }}
              source={{ html: fixImageUrls(currentQuestion.explanation) }}
            />
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            currentIndex === 0 && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              currentIndex === 0 && styles.disabledText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {currentIndex < questions.length - 1 && (
          <TouchableOpacity
            onPress={() => setCurrentIndex((prev) => prev + 1)}
            style={styles.navButton}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  option: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: 'blue',
    backgroundColor: '#dbeafe',
  },
  correctAnswer: {
    marginTop: 15,
    fontStyle: 'italic',
    color: 'green',
    fontSize: 16,
  },
  topicText: {
    fontSize: 16,
    marginTop: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    padding: 10,
  },
  navButton: {
    paddingVertical: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {},
  disabledText: {
    color: '#888',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
