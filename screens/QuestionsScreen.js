import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default  function QuestionsScreen({ route, navigation }) {
  const { setId } = route.params; // Get the setId from route params
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [paperSet, setPaperSet] = useState('');
  const [timeLeft, setTimeLeft] = useState(60*60);
  const [test, setTest] = useState('');
  const [userId, setUserId] = useState("")
  const [userSolvedId, setuserSolvedId] = useState("")
     
  console.log(setId)

  useEffect(() => {

    fetch(`https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects`)
      .then(res => res.json())
      .then(data => {
        const subject = data.data.find(term => term.id === setId);
        if (subject) {
          const subjectTitle = subject.attributes.name; // Set title (e.g. "Physics Set A")
          setPaperSet(subjectTitle);
        }
      })



  
    // Fetch the questions data based on the setId
    fetch(`https://studyneet.crudpixel.tech/jsonapi/node/question?filter[field_subject_set.id]=${setId}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.data.map(q => {
          const optionLabels = ['A', 'B', 'C', 'D'];
          const correctIndex = optionLabels.indexOf(q.attributes.field_correct_answer);

          return {
            id: q.id,
            title: q.attributes.title,
            options: q.attributes.field_option,
            correct: q.attributes.field_option[correctIndex] || ''
          };
        });

        setQuestions(formatted);
        setLoading(false);
      });

      userData();
  }, [setId]);

  const userData=async()=>{
     const user = JSON.parse(await AsyncStorage.getItem('user'));
      const user_id = user?.userid;
      setUserId(user_id);
      
  }


  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          SubmitTest(); // Auto-submit when time is over
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, [loading]);



  const currentQuestion = questions[currentIndex];
  //console.log(questions)
  const handleOptionPress = (option) => {

    if (selectedOption !== null) return;

    const qKey = `Q${currentIndex + 1}`;
    setUserAnswers(prev => ({
      ...prev,
      [qKey]: option,
    }));

    if (option === currentQuestion.correct) {
      setScore(prev => prev + 4); // assuming each question is worth 10 marks
    }
    if (option !== currentQuestion.correct) {
      setScore(prev => prev - 1); // assuming each question is worth 10 marks
    }

    console.log(option);
    setSelectedOption(option);
    // setShowResult(true); // Show the result after an option is selected
  };


  useEffect(() => {
    const qKey = `Q${currentIndex + 1}`;
    const selected = userAnswers[qKey] || null;
    setSelectedOption(selected);
  }, [currentIndex]);


  async function SubmitTest() {
    try {
      const value = await AsyncStorage.getItem('user');
      const loginUser = JSON.parse(value);

      const testResult = {
        question_paper_id: paperSet,
        user_id: loginUser.userid,
        total_question: questions.length,
        attempted: Object.keys(userAnswers).length,
        not_attempted: questions.length - Object.keys(userAnswers).length,
        total_marks: questions.length * 4,
        score: score,
        answer: JSON.stringify(userAnswers),
      };
      console.log(testResult)
      const response = await fetch('https://studyneet.crudpixel.tech/api/submit-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResult),
      });

         try {
        const res = await fetch(`https://studyneet.crudpixel.tech/api/student-result?user_id=${userId}`);
        const json = await res.json();

        const allResults = json.data || [];

        // Optional: Filter by userId just to be safe
        const userResults = allResults.filter(t => t.user_id == userId);

        setTest(userResults);
        const latestResult = userResults[userResults.length - 1];
        const solvedId = latestResult?.solved_id;

        setuserSolvedId(solvedId)
        console.log("dfdfd",solvedId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setLoading(false);
      }

      const data = await response.json();
      console.log("Result submitted:", data);

      if (response.ok) {
        Alert.alert(
          'Success',
          'Your test has been submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('test',{solved_id:userSolvedId}) }]
        );
      } else {
        console.warn("Failed to submit result:", data);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  }



  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Test Finished!</Text>
        <Button title="Submit your Test" onPress={SubmitTest} />

      </View>
    );
  }
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  return (
    <View style={styles.container}>

      <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
        Time Left: {formatTime(timeLeft)}
      </Text>


      <Text style={styles.title}>{currentIndex + 1}. {currentQuestion.title}</Text>

      {currentQuestion.options.map((opt, idx) => (
        <View key={idx} style={styles.optionBtn}>
          <Button
            title={opt}
            color={selectedOption === opt ? 'blue' : undefined}
            onPress={() => handleOptionPress(opt)}
          />

        </View>
      ))}
      <View style={styles.navigationButtons}>
        {currentIndex === 0 ? (
          <Button title="Next" onPress={() => setCurrentIndex(prev => prev + 1)} />
        ) :
          <>
            <Button title="Previous" onPress={() => setCurrentIndex(prev => prev - 1)} />
            <Button title="Next" onPress={() => setCurrentIndex(prev => prev + 1)} />
          </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  optionBtn: { marginVertical: 5 },
  result: { marginTop: 20, alignItems: 'center' },
  resultText: { fontSize: 18, marginBottom: 10 },
  navigationButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
