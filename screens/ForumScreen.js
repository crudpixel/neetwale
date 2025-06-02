import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const subjects = ['All', 'Physics', 'Chemistry', 'Biology'];

const ForumScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://studyneet.crudpixel.tech/api/student-question/all')
      .then(response => response.json())
      .then(json => {
        if (json.status === 'success') {
          const filtered = json.data.filter(item => item.field_descriptions !== null);
          setQuestions(filtered);
          setFilteredQuestions(filtered); // initially show all
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubjectFilter = (subject) => {
    setSelectedSubject(subject);
    if (subject === 'All') {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(item =>
        item.title.toLowerCase().includes(subject.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('QuestionDetails', { nid: item.nid })}
    >
      <Text style={styles.description}>{item.field_descriptions}</Text>
      <Text style={styles.author}>By: {item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
       
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(value) => handleSubjectFilter(value)}
            style={styles.picker}
            dropdownIconColor="#28a745"
          >
            {subjects.map(subject => (
              <Picker.Item key={subject} label={subject} value={subject} />
            ))}
          </Picker>
        </View>
         <TouchableOpacity
  style={styles.askButton}
  onPress={() => navigation.navigate("StudentAskQuery")}
>
  <Text style={styles.askButtonText}>Ask Question</Text>
</TouchableOpacity>

      </View>

      <FlatList
        data={filteredQuestions}
        keyExtractor={item => item.nid}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No questions found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
     borderBottomWidth:2,
     paddingBottom:10
  },
pickerContainer: {
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 5,
  overflow: 'hidden',
  backgroundColor: '#1e293b', 
},
picker: {
  height: 50,
  width: 140,
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},

  item: {
    marginTop: 20,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
   // borderRadius: 10,
   // backgroundColor: '#f9f9f9',
  },
  description: {
    fontSize: 16,
    color: 'black',
    fontWeight:600
    //textDecorationLine: 'underline',
  },
  author: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  askButton: {
  backgroundColor: '#1e293b',
  paddingVertical: 15,
  paddingHorizontal: 16,
  borderRadius: 5,
},
askButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
});

export default ForumScreen;
