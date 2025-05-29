import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CreateLiveSession = ({navigation}) => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    sessionDate: '',
    duration: '',
    fees: '',
    description: '',
    status: 'scheduled',
  });

  const [csrfToken, setCsrfToken] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const { csrf_token } = JSON.parse(storedUser);
        setCsrfToken(csrf_token);
      }
    };
    fetchToken();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
  if (!formData.title || !formData.link || !formData.sessionDate || !formData.duration || !formData.fees || !formData.description) {
    Alert.alert('Validation Error', 'Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('https://studyneet.crudpixel.tech/api/faculty-live-session/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add CSRF if your backend requires it
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      body: JSON.stringify({
        title: formData.title,
        field_description: formData.description,
        field_fees: formData.fees,
        field_meeting_link: formData.link,
        field_session_date: formData.sessionDate,
        field_session_duration: formData.duration,
        field_status: formData.status,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Live session created successfully!');

     navigation.navigate('FacultyDashboard');
      // Optionally clear form
      setFormData({
        title: '',
        link: '',
        sessionDate: '',
        duration: '',
        fees: '',
        description: '',
        status: '',
      });
    } else {
      console.log('Server error:', result);
      Alert.alert('Error', result.message || 'Failed to create session.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    Alert.alert('Error', 'An error occurred while creating the session.');
  }
};

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={formData.title}
        onChangeText={text => handleChange('title', text)}
      />

      <TextInput
        placeholder="Meeting Link"
        style={styles.input}
        value={formData.link}
        onChangeText={text => handleChange('link', text)}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: formData.sessionDate ? '#000' : '#aaa' }}>
          {formData.sessionDate || 'Select Session Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split('T')[0];
              handleChange('sessionDate', formatted);
            }
          }}
        />
      )}

      <TextInput
        placeholder="Session Duration (e.g. 60 mins)"
        style={styles.input}
        value={formData.duration}
        onChangeText={text => handleChange('duration', text)}
      />

      <TextInput
        placeholder="Fees"
        style={styles.input}
        keyboardType="numeric"
        value={formData.fees}
        onChangeText={text => handleChange('fees', text)}
      />

      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 100 }]}
        multiline
        value={formData.description}
        onChangeText={text => handleChange('description', text)}
      />
      <Text style={styles.label}>Session Status</Text>
<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={formData.status}
    onValueChange={(itemValue) => handleChange('status', itemValue)}
  >
    <Picker.Item label="Scheduled" value="scheduled" />
    <Picker.Item label="Completed" value="completed" />
  </Picker>
</View>
      <Button title="Submit" onPress={handleSubmit} color="#3949AB" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3949AB',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  
});

export default CreateLiveSession;
