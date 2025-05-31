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
  Button,

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


const [carouselItems, setCarouselItems] = useState([]);
const [activeSlide, setActiveSlide] = useState(0);

useEffect(() => {
  const fetchScheduledSessions = async () => {
    try {
      const response = await fetch('https://studyneet.crudpixel.tech/api/faculty-live-sessions?field_status=Scheduled');
      const json = await response.json();
      if (json.status === 'success') {
        setCarouselItems(json.data);
      }
    } catch (error) {
      console.error('Error fetching scheduled sessions:', error);
    }
  };

  fetchScheduledSessions();
}, []);


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

              setPhysicsAvg(result2.data.physics_score ?? '0');
              setChemistryAvg(result2.data.chemistry_score ?? '0');
              setBiologyAvg(result2.data.biology_score ?? '0');
              setPreviousYearAvg(average(scores.Previous ?? '0'));
              setMockTestAvg(average(scores.Mock ?? '0'));
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

  function handleBooking(item){
    console.log(item.field_meeting_link,item.field_fees,item.title,item.author_name);
      navigation.navigate('PayNow', {
    title: item.title,
    fees: item.field_fees,
    meetingLink: item.field_meeting_link,
    author: item.author_name,
  });
  }


const renderCarouselItem = ({ item }) => (
  <View style={styles.carouselItem}>
    <Text style={styles.sessionTitle}>{item.title}</Text>
    <View style={styles.feeRow}>
    <Text style={styles.sessionDetail}>Faculty: {item.author_name}</Text>
    <Text style={styles.sessionDetail}>Fees: ₹ {item.field_fees}</Text>
    </View>
     <View style={styles.feeRow}>
    <Text style={styles.sessionDetail}>Date: {item.field_session_date}</Text>
    <Text style={styles.sessionDescription}>{item.field_description}</Text>
    </View>
        <TouchableOpacity style={styles.bookNowButton} onPress={() => handleBooking(item)}>
      <Text style={styles.bookNowText}>Book Now</Text>
    </TouchableOpacity>
  </View>
);

  return (
    <ScrollView contentContainerStyle={styles.container}>
 <View style={styles.ViewAll}>
    <Text style={styles.sectionTitle}>Upcoming Live Sessions</Text>
    <TouchableOpacity style={styles.bookNowButton1} onPress={() => navigation.navigate("AllSession")}>
      <Text style={styles.bookNowText1}>View All Sessions</Text>
    </TouchableOpacity>
</View>
<FlatList
  data={carouselItems.slice(0,5)}
  renderItem={renderCarouselItem}
  keyExtractor={(item, index) => index.toString()}
  horizontal
  showsHorizontalScrollIndicator={false}
  snapToAlignment="center"
  pagingEnabled
  decelerationRate="fast"
    contentContainerStyle={{ paddingHorizontal: 16 }}
    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      onScroll={e => {
    const slide = Math.round(
      e.nativeEvent.contentOffset.x / (screenWidth - 32) // 90% + 16px padding
    );
    setActiveSlide(slide);
  }}
  scrollEventThrottle={16}
/>
<View style={styles.pagination}>
  {carouselItems.slice(0, 5).map((_, index) => (
    <View
      key={index}
      style={[
        styles.dot,
        { backgroundColor: index === activeSlide ? '#333' : '#ccc' },
      ]}
    />
  ))}
</View>


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
          <Button title='Raise Question doubt' onPress={()=>navigation.navigate("StudentAskQuery")}/>
        </View>
      </View>

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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginVertical: 15,
     paddingLeft:5,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 20,

  },
  scoreRankContainer: {
    flex: 1,
    gap: 12,
    margin:3
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
  width:screenWidth-30, // Full screen width
  backgroundColor: '#fff',
  borderRadius: 5,
  overflow: 'hidden',
  paddingHorizontal: 20,
  paddingVertical:10,
  borderWidth: 1,
  marginRight:8,
  borderColor:"#ccc"
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
  },
  rightArrow:{
    height: 20,
    width: 20,
  },
  sessionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1e293b',
},
sessionDetail: {
  fontSize: 16,
  color: 'black',
  marginTop:8
},
sessionDescription: {
  fontSize: 16,
  color: 'black',
  marginTop:8
},
feeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap:20
},

bookNowButton: {
  paddingVertical: 8,
  //paddingHorizontal: 12,
  marginTop:15,
  color:"blue",
  borderTopWidth:1,
  borderColor:"#ccc",
},

bookNowText: {
  color: '#3949AB',
  fontSize:16,
  fontWeight:600,
  textDecorationLine:1
},
bookNowText1:{
 color: '#3949AB',
  fontSize:16,
  fontWeight:600,
  borderBottomWidth:1,
  borderBottomColor:"#3949AB"
},

ViewAll:{
  flexDirection:"row",
  alignItems:"center",
 
  gap:10,


},
pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginHorizontal: 4,
  backgroundColor: '#ccc',
},
  
});
