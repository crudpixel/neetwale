import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import { logoutUser } from '../cookiesApi';

const subjects = ['Physics', 'Chemistry', 'Biology'];

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState('Guest');
  const [userId, setUserId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isFacultyUser, setIsFacultyUser] = useState(false);

  const Facultyuser = false;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setUsername(userObj.name || 'Guest');
        setUserId(userObj.userid?.toString());

        const userDetailsRes = await fetch(
          `https://studyneet.crudpixel.tech/api/user/${userObj.userid}/roles`
        );
        const userDetails = await userDetailsRes.json();

        const isFaculty = userDetails.roles?.some(role =>
          ['physics_faculty', 'chemistry_faculty', 'biology_faculty'].includes(role)
        );

        setIsFacultyUser(isFaculty); // ✅ update state
      }
    };

    fetchUser();
    fetchLeaderboard();
  }, []);
  

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('https://studyneet.crudpixel.tech/api/neet/get-all-average-scores');
      const json = await res.json();
      if (json.status === 'success') {
        setLeaderboardData(json.data);
      }
    } catch (err) {
      console.error('Leaderboard fetch failed:', err);
    }
  };


  const fetchUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.name || 'Guest');
      setUserId(parsedUser.userid?.toString());
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLeaderboard();
  }, []);

  const getSortedLeaderboard = (subjectKey) => {
    const sorted = [...leaderboardData].sort(
      (a, b) => parseFloat(b[subjectKey]) - parseFloat(a[subjectKey])
    );

    const top3 = sorted.slice(0, 3);
    const currentUserIndex = sorted.findIndex(u => u.uid === userId);

    let userEntry = null;
    if (currentUserIndex !== -1 && currentUserIndex >= 3) {
      userEntry = {
        ...sorted[currentUserIndex],
        actualRank: currentUserIndex + 1,
      };
    }

    return [...top3, ...(userEntry ? [userEntry] : [])];
  };

  const renderTable = (subject) => {
    const key = `${subject.toLowerCase()}_score`;
    const data = getSortedLeaderboard(key);

    return data.map((item, idx) => {
      const rank = item.actualRank || idx + 1;
      const isCurrentUser = item.uid === userId;
      return (
        <View key={rank} style={[styles.row, isCurrentUser && styles.highlightRow]}>
          <Text style={styles.cell}>{rank}</Text>
          <Text style={styles.cell}>{item.username}</Text>
          <Text style={styles.cell}>{parseFloat(item[key]).toFixed(1)}</Text>
        </View>
      );
    });
  };

  const handleLogout = async () => {
   // await AsyncStorage.removeItem('user');

   const api = axios.create({
  baseURL: 'https://studyneet.crudpixel.tech',
  withCredentials: true,
});
   const logoutUser = async () => {
  
  try {
    const userData = await AsyncStorage.getItem('user');
    const userObj = JSON.parse(userData);
          const userDetailsRes = await fetch(
        `https://studyneet.crudpixel.tech/api/user/${userObj.userid}/roles`
      );

    const logoutToken = userObj?.logout_token;

    if (!logoutToken) {
      throw new Error('Logout token missing');
    }

    // Logout using token
    await api.post(`/user/logout?_format=json&token=${logoutToken}`);

    console.log('Logged out and session cleared');
    await AsyncStorage.removeItem('user');
    navigation.replace('Home');
  } catch (err) {
    console.warn('Logout failed:', err.response?.data || err.message);
  }
};
    logoutUser();
  navigation.replace('Home');
  };

 return (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.card}>
      <View style={styles.avatar}>
  <Text style={styles.avatarText}>{username?.charAt(0)}</Text>
</View>

      <Text style={styles.label}>Hello!</Text>
      <Text style={styles.username}>{username}</Text>
    </View>

    {/* ✅ Only show leaderboard for students */}
    {!isFacultyUser && (
      <>
        <View style={styles.tabContainer}>
          {subjects.map((sub) => (
            <TouchableOpacity
              key={sub}
              style={[styles.tab, selectedSubject === sub && styles.activeTab]}
              onPress={() => setSelectedSubject(sub)}
            >
              <Text style={styles.tabText}>{sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Rank</Text>
          <Text style={styles.headerCell}>Username</Text>
          <Text style={styles.headerCell}>Score</Text>
        </View>

        {renderTable(selectedSubject)}
      </>
    )}

    {/* ✅ Logout button for everyone */}
<TouchableOpacity
  onPress={() => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  }}
  style={styles.logoutButton}
>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
 avatar: {
  width: 80,
  height: 80,
  backgroundColor: '#0984e3',
  borderRadius: 40,
  marginBottom: 16,
  justifyContent: 'center',
  alignItems: 'center',
},
  avatarText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#fff',
},
  label: {
    fontSize: 18,
    color: '#555',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    width: '100%',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#dcdde1',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0984e3',
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
    width: '100%',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  cell: {
    flex: 1,
    color: '#2f3640',
    textAlign: 'center',
  },
  highlightRow: {
    backgroundColor: '#dff9fb',
    borderRadius: 6,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'tomato',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});