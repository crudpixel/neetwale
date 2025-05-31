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
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title:  { 
    fontSize: 20,
    marginBottom: 20,
    padding:10,
   // borderWidth:1,
    borderColor:"#eee",
    backgroundColor: '#E3F2FD'
    },

  chapter: {
    padding: 15,
    marginBottom: 10,
    borderBottomWidth:1,
    borderBottomColor: '#eee',
  },
  chapterText: { fontSize: 18 },
});
