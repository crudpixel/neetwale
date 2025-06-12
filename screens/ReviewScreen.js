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

  useEffect(() => {
    fetch(
      `https://studyneet.crudpixel.tech/jsonapi/node/question?filter[field_subject_set.name]=${encodeURIComponent(
        testData.question_paper_id
      )}&include=field_subject_topics`
    )
      .then((res) => res.json())
      .then((data) => {
        const optionLabels = ['A', 'B', 'C', 'D'];
        const topicMap = {};

        data.included?.forEach((item) => {
          if (item.type === 'taxonomy_term--subject_topic') {
            topicMap[item.id] = item.attributes.name;
          }
        });

        const formatted = data.data.map((q, idx) => {
          const options = q.attributes.field_option;
          const correctLetter = q.attributes.field_correct_answer?.trim();

          let correctOption = '';
          if (optionLabels.includes(correctLetter)) {
            const index = optionLabels.indexOf(correctLetter);
            correctOption = options[index] || 'Not Available';
          } else {
            correctOption =
              options.find(
                (opt) =>
                  opt.trim().toLowerCase() === correctLetter?.toLowerCase()
              ) || 'Not Available';
          }

          const topicId = q.relationships.field_subject_topics?.data?.id;
          const topicName = topicMap[topicId] || 'Unknown Topic';

          return {
            title: q.attributes.field_question?.value || '',
            options,
            correct: correctOption,
            qKey: `Q${idx + 1}`,
            topicName,
            explanation: q.attributes.field_answer_explanation?.processed || '',
          };
        });

        setQuestions(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading questions:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = studentAnswers[currentQuestion.qKey];

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

      {/* Navigation Buttons */}
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
