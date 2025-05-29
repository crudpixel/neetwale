import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditSessionForm = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { nid, title, field_fees, field_session_date, field_status } = route.params;

  const [sessionTitle, setSessionTitle] = useState(title);
  const [fees, setFees] = useState(field_fees);
  const [date, setDate] = useState(field_session_date);
  const [status, setStatus] = useState(field_status);
  console.log(nid, title, field_fees, field_session_date, field_status)

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://studyneet.crudpixel.tech/api/faculty-live-session/update?nid=${nid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nid:nid,
          title: sessionTitle,
          field_fees: fees,
          field_session_date: date,
          field_status: status,
        }),
      });

      const json = await response.json();

      if (json.status === 'success') {
        Alert.alert('Success', 'Session updated successfully');
        navigation.goBack(); // Go back to dashboard
      } else {
        Alert.alert('Error', 'Failed to update session');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={sessionTitle} onChangeText={setSessionTitle} style={styles.input} />

      <Text style={styles.label}>Fees</Text>
      <TextInput value={fees} onChangeText={setFees} style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Date</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} />

      <Text style={styles.label}>Status</Text>
      <TextInput value={status} onChangeText={setStatus} style={styles.input} />

      <Button title="Update Session" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
});

export default EditSessionForm;
