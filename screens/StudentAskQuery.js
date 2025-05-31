import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView,navigation } from 'react-native';

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
        placeholder="Enter your question title"
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

      <Button title="Submit Question" onPress={handleSubmit} />
      <Button title="See Your Raised Question" onPress={()=>navigation.navigate("AllRaiseQuestion")} />

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
});

export default StudentAskQuery;
