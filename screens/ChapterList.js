import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChapterList({ route, navigation }) {
  const { title, chapters } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {chapters.map((chapter, index) => (
        <TouchableOpacity
          key={index}
          style={styles.chapter}
          onPress={() =>
            navigation.navigate('PDFScreen', {
              title: chapter.name,
              url: chapter.url,
            })
          }
        >
          <Text style={styles.chapterText}>{chapter.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  chapter: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  chapterText: { fontSize: 18 },
});
