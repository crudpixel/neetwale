import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView,navigation ,TouchableOpacity} from 'react-native';

const StudentAskQuery = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async () => {
    if (!title || !details) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('https://studyneet.crudpixel.tech/api/student-question/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          field_descriptions: details,
        }),
      });

      const data = await response.json();
      console.log(data.nid);

      if (response.ok) {
        Alert.alert('Your Query has been raised', 'Thank you for asking.');
        setTitle('');
        setDetails('');
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or invalid API');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter Your Subject"
        style={styles.input}
      />

      <Text style={styles.label}>Question Details</Text>
      <TextInput
        value={details}
        onChangeText={setDetails}
        placeholder="Describe your question"
        multiline
        numberOfLines={6}
        style={[styles.input, styles.textArea]}
      />
<View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
    <Text style={styles.buttonText}>Submit Question</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate("AllRaiseQuestion")}>
    <Text style={styles.buttonText}>See Your Raised Question</Text>
  </TouchableOpacity>
</View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
  marginTop: 20,
  flexDirection: 'column',
  gap: 12, 
},

submitButton: {
  backgroundColor: '#007bff',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
},

viewButton: {
  backgroundColor: '#28a745',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
},

buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default StudentAskQuery;
