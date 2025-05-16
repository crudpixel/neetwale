import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [score, setScore] = useState(85);
  const [rank, setRank] = useState(12);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj.name || '');
      }
    };
    checkUser();
  }, []);

  const subjects = [
    { title: 'Physics' },
    { title: 'Chemistry' },
    { title: 'Biology' },
    { title: 'Previous Year Papers' },
    { title: 'NCERT' },
    { title: 'Mock Test' },
  ];

  const carouselItems = [
    {
      title: 'Join NEET Mock Tests',
      image: 'https://via.placeholder.com/300x150.png?text=Mock+Test',
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
      <Text style={styles.title}>Hello {user}!</Text>

      {/* Profile Row */}
      <View style={styles.profileRow}>
        <Image
          source={{
            uri: 'https://www.w3schools.com/howto/img_avatar.png',
          }}
          style={styles.profileImage}
        />
        <View style={styles.scoreRankContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Score</Text>
            <Text style={styles.cardValue}>{score}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Rank</Text>
            <Text style={styles.cardValue}>#{rank}</Text>
          </View>
        </View>
      </View>

      {/* Carousel */}
      <Text style={styles.sectionTitle}>Explore</Text>
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

      {/* Quick Access */}
      <Text style={styles.quickAccessTitle}>Quick Access</Text>
      <View style={styles.subjectsContainer}>
        {subjects.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subjectCard}
            onPress={() => {
              // navigation.navigate('YourTargetScreen', { subject: item.title });
            }}
          >
            <Text style={styles.subjectText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
  },
  scoreRankContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0063e5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  carouselItem: {
    width: screenWidth * 0.8,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  },
  carouselText: {
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickAccessTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
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
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0063e5',
    textAlign: 'center',
  },
});
