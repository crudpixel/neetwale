import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator,ScrollView} from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHTML, { RenderHTMLSource } from 'react-native-render-html'
export default function ReviewScreen({ route, navigation }) {
  const { testData } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const studentAnswers = JSON.parse(testData.answer);
  const { width } = useWindowDimensions();
  console.log(testData)
  useEffect(() => {
    // Fetch the actual questions from backend based on question_paper_id
   fetch(`https://studyneet.crudpixel.tech/jsonapi/node/question?filter[field_subject_set.name]=${encodeURIComponent(testData.question_paper_id)}&include=field_subject_topics`)

      .then(res => res.json())
.then(data => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  // Create a map of topic ID => topic name
  const topicMap = {};
  data.included?.forEach(item => {
    if (item.type === 'taxonomy_term--subject_topic') {
      topicMap[item.id] = item.attributes.name;
    }
  });

  const formatted = data.data.map((q, idx) => {
    const correctIndex = optionLabels.indexOf(q.attributes.field_correct_answer);

    // Get topic ID from relationships
    const topicId = q.relationships.field_subject_topics?.data?.id;
    const topicName = topicMap[topicId] || 'Unknown Topic';
    console.log(topicMap);
    return {
      title: q.attributes.field_question?.value || '',
      options: q.attributes.field_option,
      correct: q.attributes.field_option[correctIndex],
      explanation: q.attributes.field_answer_explanation?.processed || '',
      qKey: `Q${idx + 1}`,
      topicName,
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

      {/* <Text style={styles.questionText}>{currentIndex + 1}. {currentQuestion.title}</Text> */}

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 5 }}>
                    {currentIndex + 1}.
                  </Text>
                  <View style={{ flex: 1 }}>
                    <RenderHTML
                      contentWidth={width}
                      tagsStyles={{
                        p: { fontSize: 18, color: 'black', marginBottom: 10 },
                        img: {
                          maxWidth: '100%',
                          height: undefined,
                          display: 'flex', // ensures proper layout
                          resizeMode: 'contain'
                        }
                      }}
                      source={{ html: currentQuestion.title }}
                    />
                  </View>
                </View>
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
       <ScrollView>
      <Text style={styles.correctAnswer}>✅ Correct Answer: {currentQuestion.correct}</Text>
      <Text style={styles.topicText}>📘 Topic: {currentQuestion.topicName}</Text>
      {currentQuestion.explanation ? (
     
       // <Text style={styles.explanationText}>💡 Explanation: {currentQuestion.explanation.replace(/<[^>]+>/g, " ")}</Text>
       <RenderHTML  
          tagsStyles={{
               p: { fontSize: 16, color: 'black',margin:10 },
               ul: { paddingLeft: 20, },
               li: { fontSize:16 ,marginBottom:10, fontWeight:400}
         }}
    
    contentWidth={width} source={{ html: currentQuestion.explanation }} />

      ) : null}

</ScrollView>
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
  explanAnswer:{
    fontSize:26,
    color:'red'
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
