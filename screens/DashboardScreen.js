import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Button
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreContext } from '../src/contexts/ScoreContext';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {

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

  useFocusEffect(
    useCallback(() => {
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
                Previous: [],
                Mock: [],
              };

              Object.values(tempLatestSubmissions).forEach((item) => {
                const subject = item.question_paper_id;
                const score = Number(item.score);

                if (subject.includes('Previous')) {
                  scores.Previous.push(score);
                } else if (subject.includes('Mock')) {
                  scores.Mock.push(score);
                }
              });

              const average = (arr) =>
                arr.length > 0
                  ? (arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(2)
                  : '0';

              const response2 = await fetch(
                `https://studyneet.crudpixel.tech/api/neet/get-all-average-scores?user_id=${userId}`
              );
              const result2 = await response2.json();
              console.log(result2)

              setPhysicsAvg(result2.data.physics_score);
              setChemistryAvg(result2.data.chemistry_score);
              setBiologyAvg(result2.data.biology_score);
              setPreviousYearAvg(average(scores.Previous));
              setMockTestAvg(average(scores.Mock));
            }
          }
        } catch (error) {
          console.error('Error fetching user results:', error);
        }
      };

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

  const subjects = [
    { title: 'Physics Test' },
    { title: 'Chemistry Test' },
    { title: 'Biology Test' },
    { title: 'Previous Year Papers' },
    { title: 'Notes' },
    { title: 'Mock Test' },
  ];

  const carouselItems = [
    {
      title: 'Join NEET Mock Tests',
      image: 'data:image/jpeg;base64,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',
    },
    {
      title: 'Revise with NCERT Summaries',
      image: 'https://via.placeholder.com/300x150.png?text=NCERT+Summary',
    },
    {
      title: 'Attend Live Doubt Sessions',
      image: 'https://via.placeholder.com/300x150.png?text=Live+Session',
    },
    {
      title: 'Practice PYQs Daily',
      image: 'https://via.placeholder.com/300x150.png?text=PYQs',
    },
    {
      title: 'Join Peer Discussions',
      image: 'https://via.placeholder.com/300x150.png?text=Peer+Forum',
    },
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <Text style={styles.carouselText}>{item.title}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* <Text style={styles.sectionTitle}>Explore</Text> */}
      <FlatList
        data={carouselItems}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        pagingEnabled
        decelerationRate="fast"
      />

      <Text style={styles.sectionTitle}>Your Progress</Text>

      <View style={styles.profileRow}>
        <View style={styles.scoreRankContainer}>
          <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
            <View style={styles.card1}>
              <Image source={require('../asstes/physics.png')} style={styles.iconImg} />
              <View>
                <Text style={styles.cardTitle}>Physics</Text>
                <Text style={styles.cardValue}>Your Score: {physicsAvg} / </Text>
                <Text style={styles.cardValue}>Completed: {attemptedSetsPerSubject.Physics}/{setsCountPerSubject.Physics - 1} sets</Text>
              </View>
            </View>
            <View style={styles.btn1}>
              <TouchableOpacity onPress={() => navigation.navigate('Question-sets', { subject: "Physics" })} style={styles.button}>
                <Text style={styles.buttonText}>Test Series</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Recommendation", { subject: "Physics" })} style={styles.button}>
                <Text style={styles.buttonText}>Recommendations</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: '#F3E5F5' }]}>
            <View style={styles.card1}>
              <Image source={require('../asstes/chemistry.png')} style={styles.iconImg} />
              <View>
                <Text style={styles.cardTitle}>Chemistry</Text>
                <Text style={styles.cardValue}>Your Score: {chemistryAvg} /  </Text>
                <Text style={styles.cardValue}>Completed: {attemptedSetsPerSubject.Chemistry}/{setsCountPerSubject.Chemistry - 1} sets</Text>
              </View>
            </View>
            <View style={styles.btn1}>
              <TouchableOpacity onPress={() => navigation.navigate("Question-sets", { subject: "Chemistry" })} style={styles.button}>
                <Text style={styles.buttonText}>Test Series</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Recommendation", { subject: "Chemistry" })} style={styles.button}>
                <Text style={styles.buttonText}>Recommendations</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.card, { backgroundColor: '#F1F8E9' }]}>
            <View style={styles.card1}>
              <Image source={require('../asstes/molecular.png')} style={styles.iconImg} />
              <View>
                <Text style={styles.cardTitle}>Biology </Text>

                <Text style={styles.cardValue}>Your Score: {biologyAvg}</Text>

                <Text style={styles.cardValue}>Completed: {attemptedSetsPerSubject.Biology}/{setsCountPerSubject.Biology - 1} sets</Text>
              </View>
            </View>
            <View style={styles.btn1}>
              <TouchableOpacity onPress={() => navigation.navigate("Question-sets", { subject: "Biology" })} style={styles.button}>
                <Text style={styles.buttonText}>Test Series</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Recommendation", { subject: "Biology" })} style={styles.button}>
                <Text style={styles.buttonText}>Recommendations</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.card, { backgroundColor: '#EFEBE9' }]}>
            <View style={styles.card1}>
            <Image source={require('../asstes/test.png')} style={styles.iconImg} />
            <View>
              <Text style={styles.cardTitle}>Previous Year Set </Text>


              <Text style={styles.cardValue}>Your Score: {previousYearAvg}</Text>

              <Text style={styles.cardValue}>Completed: {attemptedSetsPerSubject.Previous}/{setsCountPerSubject.Previous - 1} sets</Text>
          </View>
            </View>
             <View style={styles.btn1}>
             <TouchableOpacity onPress={() => navigation.navigate("Question-sets", { subject: "Previous Year Paper" })} style={styles.button}>
                <Text style={styles.buttonText}>Test Series</Text>
              </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.navigate("Recommendation", { subject: "Previous Year" })} style={styles.button}>
                <Text style={styles.buttonText}>Recommendations</Text>
              </TouchableOpacity>
              </View>
          </View>
          <View style={[styles.card, { backgroundColor: '#FFF8E1' }]}>
             <View style={styles.card1}>
            <Image source={require('../asstes/exam-time.png')} style={styles.iconImg} />
            <View>
              <Text style={styles.cardTitle}>Mock Test</Text>

              <Text style={styles.cardValue}>Your Score: {mockTestAvg}</Text>

              <Text style={styles.cardValue}>Completed: {attemptedSetsPerSubject.Mock}/{setsCountPerSubject.Mock - 1} sets</Text>
           </View>
            </View>
            <View style={styles.btn1}>
                         <TouchableOpacity onPress={() => navigation.navigate("Question-sets", { subject: "All Subject (Mock Test)" })} style={styles.button}>
                <Text style={styles.buttonText}>Test Series</Text>
              </TouchableOpacity>
                         <TouchableOpacity onPress={() => navigation.navigate("Recommendation", { subject: "Mock" })} style={styles.button}>
                <Text style={styles.buttonText}>Recommendations</Text>
              </TouchableOpacity>
              </View>
          </View>
        </View>
      </View>



      {/* <Text style={styles.quickAccessTitle}>Quick Access</Text> */}
      {/* <Button title="Purchase our plan" onPress={() => navigation.navigate('PayNow')} /> */}

      {/* <View style={styles.subjectsContainer}>
        {subjects.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subjectCard}
            onPress={() => {
              if (item.title === 'Physics Test') {
                navigation.navigate('Question-sets', { subject: "Physics" });
              }
              if (item.title === 'Chemistry Test') {
                navigation.navigate('Question-sets', { subject: "Chemistry" });
              }
              if (item.title === 'Biology Test') {
                navigation.navigate('Question-sets', { subject: "Biology" });
              }
              if (item.title === 'Previous Year Papers') {
                navigation.navigate('Question-sets', { subject: "Previous Year Paper" });
              }
              if (item.title === 'Mock Test') {
                navigation.navigate('Question-sets', { subject: "All Subject (Mock Test)" });
              }
              if (item.title === 'Notes') {
                navigation.navigate('studymaterial');
              }
            }}
          >
            <Text style={styles.subjectText}>{item.title}</Text>
          </TouchableOpacity>

        ))}


      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#334155',
    marginVertical: 15,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scoreRankContainer: {
    flex: 1,
    gap: 12,
  },
  card: {

    justifyContent: "flex-start",
    gap: 20,
    borderRadius: 5,
    padding: 16,

  },
  card1: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    gap: 20,
  },

  btn1: {
    flexDirection: 'row',
    justifyContent: "center",
    gap: 10,


  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
    marginTop: 0,
  },
  cardValue: {
    fontSize: 16,
    color: 'black',
    marginBottom: 4,
  },
  recommWraper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    // backgroundColor: '#facc15',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 8,
    width: 175,
    borderWidth: 1,
    borderColor: "#ccc"


  },
  buttonText: {
    fontSize: 16,

    color: '#1e293b',
    textAlign: "center"

  },
  carouselItem: {
    width: screenWidth * 0.8,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  carouselImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  carouselText: {
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  quickAccessTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
    marginVertical: 15,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
    textAlign: 'center',
  },
  iconImg: {
    height: 60,
    width: 60,
    borderRadius: 10
  }
});
