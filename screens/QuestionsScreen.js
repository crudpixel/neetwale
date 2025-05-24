import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreContext } from '../src/contexts/ScoreContext';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

// Inside the component

export default function QuestionsScreen({ route, navigation }) {
  const { setId, timer } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [paperSet, setPaperSet] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [test, setTest] = useState('');
  const [userId, setUserId] = useState('');
  const [userSolvedId, setuserSolvedId] = useState('');
  const [mode, setMode] = useState('question');
  const [markedForReview, setMarkedForReview] = useState({});
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        mode === 'review' ? (
          <Button
            title="X"
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setMode('question');
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setMode('review');
            }}
            style={{ marginRight: 15 }}
          >
            <MaterialIcons name="preview" size={28} color="black" />
          </TouchableOpacity>
        ),
    });
  }, [navigation, mode]);

  // ----------------------------------------------------------------------------------------------------------------//
  const [user, setUser] = useState('');
  const [physicsAvg, setPhysicsAvg] = useState('0');
  const [chemistryAvg, setChemistryAvg] = useState('0');
  const [biologyAvg, setBiologyAvg] = useState('0');
  const [previousYearAvg, setPreviousYearAvg] = useState('0');
  const [mockTestAvg, setMockTestAvg] = useState('0');
  const [setsCountPerSubject, setSetsCountPerSubject] = useState({
    Physics: 0,
    Chemistry: 0,
    Biology: 0,
    Previous: 0,
    Mock: 0,
  });
  const [attemptedSetsPerSubject, setAttemptedSetsPerSubject] = useState({
    Physics: 0,
    Chemistry: 0,
    Biology: 0,
    Previous: 0,
    Mock: 0,
  });
  const [latestSubmissions, setLatestSubmissions] = useState({});


  const fetchUserResults = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        const userId = userObj.userid;
        setUser(userObj.name || '');

        const response = await fetch(
          `https://studyneet.crudpixel.tech/neet-tracker/all-users-results?user_id=${userId}`
        );
        const result = await response.json();

        if (result.status === 'success') {
          const solvedData = result.data || [];

          const tempLatestSubmissions = {};
          solvedData.forEach((item) => {
            const key = item.question_paper_id;
            if (
              !tempLatestSubmissions[key] ||
              parseInt(item.solved_id) > parseInt(tempLatestSubmissions[key].solved_id)
            ) {
              tempLatestSubmissions[key] = item;
            }
          });

          setLatestSubmissions(tempLatestSubmissions);

          const scores = {
            Physics: [],
            Chemistry: [],
            Biology: [],
            Previous: [],
            Mock: [],
          };

          Object.values(tempLatestSubmissions).forEach((item) => {
            const subject = item.question_paper_id;
            const score = Number(item.score);

            if (subject.includes('Physics')) {
              scores.Physics.push(score);
            } else if (subject.includes('Chemistry')) {
              scores.Chemistry.push(score);
            } else if (subject.includes('Biology')) {
              scores.Biology.push(score);
            }
            else if (subject.includes('Previous')) {
              scores.Previous.push(score);
            }
            else if (subject.includes('Mock')) {
              scores.Mock.push(score);
            }
          });

          const average = (arr) =>
            arr.length > 0
              ? (arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(2)
              : '0';

          setPhysicsAvg(average(scores.Physics));
          setChemistryAvg(average(scores.Chemistry));
          setBiologyAvg(average(scores.Biology));
          setPreviousYearAvg(average(scores.Previous));
          setMockTestAvg(average(scores.Mock));
        }
      }
    } catch (error) {
      console.error('Error fetching user results:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {

      fetchUserResults();
      const fetchSetCounts = async () => {
        try {
          const res = await fetch('https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects');
          const json = await res.json();
          const allSubjects = json.data;

          const sets = allSubjects.filter(
            (item) => item.relationships?.parent?.data !== null
          );

          const counts = {
            Physics: 0,
            Chemistry: 0,
            Biology: 0,
            Previous: 0,
            Mock: 0,
          };

          sets.forEach((set) => {
            const name = set.attributes.name.toLowerCase();
            if (name.includes('physics')) counts.Physics += 1;
            else if (name.includes('chemistry')) counts.Chemistry += 1;
            else if (name.includes('biology')) counts.Biology += 1;
            else if (name.includes('previous')) counts.Previous += 1;
            else if (name.includes('mock')) counts.Mock += 1;
          });

          setSetsCountPerSubject(counts);
        } catch (error) {
          console.error('Error fetching set counts:', error);
        }
      };

      fetchUserResults();
      fetchSetCounts();
    }, [])
  );


  useEffect(() => {
    const attemptedCounts = {
      Physics: new Set(),
      Chemistry: new Set(),
      Biology: new Set(),
      Previous: new Set(),
      Mock: new Set(),
    };

    Object.values(latestSubmissions).forEach((item) => {
      const subject = item.question_paper_id;
      if (subject.includes('Physics')) attemptedCounts.Physics.add(subject);
      else if (subject.includes('Chemistry')) attemptedCounts.Chemistry.add(subject);
      else if (subject.includes('Biology')) attemptedCounts.Biology.add(subject);
      else if (subject.includes('Previous')) attemptedCounts.Previous.add(subject);
      else if (subject.includes('Mock')) attemptedCounts.Mock.add(subject);
    });

    setAttemptedSetsPerSubject({
      Physics: attemptedCounts.Physics.size,
      Chemistry: attemptedCounts.Chemistry.size,
      Biology: attemptedCounts.Biology.size,
      Previous: attemptedCounts.Previous.size,
      Mock: attemptedCounts.Mock.size,
    });
  }, [latestSubmissions]);

  // --------------------------------------------------------------------------------------------------------------------//


  useEffect(() => {
    fetch(`https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects`)
      .then(res => res.json())
      .then(data => {
        const subject = data.data.find(term => term.id === setId);
        if (subject) {
          setPaperSet(subject.attributes.name);
        }
      });

    fetch(
      `https://studyneet.crudpixel.tech/jsonapi/node/question?filter[field_subject_set.id]=${setId}&include=field_subject_topics`
    )
      .then(res => res.json())
.then(data => {
  const included = data.included || [];

  const formatted = data.data.map(q => {
    const optionLabels = ['A', 'B', 'C', 'D'];
    const correctIndex = optionLabels.indexOf(q.attributes.field_correct_answer);

    // Find topic name from included
const topicId = q.relationships.field_subject_topics?.data?.id;

const topic = included.find(
  i => i.id === topicId && i.type === 'taxonomy_term--subject_topic'
)?.attributes?.name || 'Unknown';

console.log( topic);




    return {
      id: q.id,
      title: q.attributes.field_question?.value || '',
      options: q.attributes.field_option,
      correct: q.attributes.field_option[correctIndex] || '',
      topic: topic,
    };
  });

  setQuestions(formatted);
  setLoading(false);
});


    userData();
  }, [setId]);

  const userData = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const user_id = user?.userid;
    setUserId(user_id);
  };

  useEffect(() => {
    if (!loading && questions.length > 0 && timeLeft === null) {
      const timerNumber = Number(timer);
      if (!isNaN(timerNumber) && timerNumber !== 0) {
        setTimeLeft(questions.length * timerNumber * 60);
      } else {
        setTimeLeft(questions.length * 1 * 60);
      }
    }
  }, [loading, questions, timeLeft, timer]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isFocused) {
            SubmitTest(); // ✅ Only submit if screen is focused
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, isFocused]);

  const currentQuestion = questions[currentIndex];

  const handleOptionPress = (option) => {
    if (selectedOption !== null) return;

    const qKey = `Q${currentIndex + 1}`;
    setUserAnswers(prev => ({
      ...prev,
      [qKey]: option,
    }));

    if (option === currentQuestion.correct) {
      setScore(prev => prev + 4);
    } else {
      setScore(prev => prev - 1);
    }

    setSelectedOption(option);
    setMarkedForReview(prev => {
      const updated = { ...prev };
      delete updated[currentIndex];
      return updated;
    });
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
        const res = await fetch(
          `https://studyneet.crudpixel.tech/api/student-result?user_id=${userId}`
        );
        const json = await res.json();
        const allResults = json.data || [];
        const userResults = allResults.filter(t => t.user_id == userId);
        const latestResult = userResults[userResults.length - 1];
        const solvedId = latestResult?.solved_id;

        setuserSolvedId(solvedId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setLoading(false);
      }

      // -------------------------------------------------------------------------------//

      const topicStatsMap = {};

questions.forEach((q, index) => {
  const qKey = `Q${index + 1}`;
  const selected = userAnswers[qKey];
  const topic = q.topic || 'Unknown';

  if (!topicStatsMap[topic]) {
    topicStatsMap[topic] = { topic, correct: 0, wrong: 0 };
  }

  if (selected) {
    if (selected === q.correct) {
      topicStatsMap[topic].correct += 1;
    } else {
      topicStatsMap[topic].wrong += 1;
    }
  } else {
    topicStatsMap[topic].wrong += 1; // treat unattempted as wrong if needed
  }
});

const topicStats = Object.values(topicStatsMap).map(stat => ({
  ...stat,
  percentage: ((stat.correct / (stat.correct + stat.wrong)) * 100).toFixed(2),
}));

console.log('📊 Topic Stats:', topicStats);


      //--------------------------------------------------------------------------------//

      const data = await response.json();
      if (response.ok) {
        const knownSubjects = ["Physics", "Chemistry", "Biology","Previous Year","Mock"];
        const subject = knownSubjects.find(s =>
          paperSet.toLowerCase().includes(s.toLowerCase())
        );
        console.log("Akkkk",subject)

        await fetch('https://studyneet.crudpixel.tech/neet-tracker/update-leaderboard-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: loginUser.userid,
            subject: subject,
            score: score,
            username: loginUser.name,
          }),
        });



        await fetch('https://studyneet.crudpixel.tech/api/neet/save-average-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: loginUser.userid,
            username: loginUser.name,
            physics_score: physicsAvg,
            chemistry_score: chemistryAvg,
            biology_score: biologyAvg,

          }),
        });



  for (const perTopic of topicStats) {
  await fetch('https://studyneet.crudpixel.tech/api/submit-recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: loginUser.userid,
      subject: subject,
      recommendation_topic: perTopic, 
      status: "pending",
    }),
  });
}






        fetchUserResults();

        Alert.alert(
          'Success',
          'Your test has been submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('test', { solved_id: userSolvedId, questionLength: questions.length , topicStats : topicStats }) }]
        );
      } else {
        console.warn('Failed to submit result:', data);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;



  return (
    <View style={styles.container}>
      {mode === 'review' ? (
        <View style={styles.reviewPanel}>
          <Text style={styles.reviewTitle}>Tap a question to navigate</Text>
          <View style={styles.reviewGrid}>
            {questions.map((q, index) => {
              const qKey = `Q${index + 1}`;
              const answered = userAnswers[qKey] !== undefined;

              return (
                <Text
                  key={index}
                  style={[
                    styles.reviewItem,
                    {

                      backgroundColor:
                        answered
                          ? '#4CAF50'
                          : markedForReview[index]
                            ? 'orange'
                            : 'transparent',

                    },
                  ]}
                  onPress={() => {
                    setCurrentIndex(index);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setMode('question');
                  }}
                >
                  {index + 1}
                </Text>
              );
            })}
          </View>
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
            Time Left: {formatTime(timeLeft)}
          </Text>

          {/* <Text style={styles.title}>
            {currentIndex + 1}. {currentQuestion.title}
          </Text> */}

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
            {/* Previous Button */}
            {currentIndex > 0 && (
              <Button title="Previous" onPress={() => setCurrentIndex(prev => prev - 1)} />
            )}

            {/* Mark for Review Button in the center */}
            <Button
              title="Mark for Review"

              onPress={() =>
                setMarkedForReview(prev => ({
                  ...prev,
                  [currentIndex]: true,
                }))
              }
            />


            {/* Next or Submit Button */}
            {currentIndex < questions.length - 1 ? (
              <Button title="Next" onPress={() => setCurrentIndex(prev => prev + 1)} />
            ) : (
              <Button title="Submit" onPress={SubmitTest} />
            )}
          </View>


        </>
      )}
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
    justifyContent: 'space-between',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reviewPanel: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  reviewItem: {
    width: 35,
    height: 35,
    margin: 5,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 35,
  },
});
