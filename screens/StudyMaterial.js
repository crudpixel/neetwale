import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { materials } from './SubjectData';

export default function StudyMaterial({ navigation }) {
  return (
    <View style={styles.container}>
      {materials.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() =>
            navigation.navigate('ChapterList', {
              title: item.title,
              chapters: item.chapters,
            })
          }
        >
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: {
    backgroundColor: '#d6eaff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  text: { fontSize: 18 },
});
