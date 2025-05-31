import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native';
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
              rightArrow:item.arrow,
              chapters: item.chapters,
            })
          }
        >
          <View style={styles.subject}>
          <Text style={styles.text}>{item.title}</Text>
          <Image source={item.arrow} style={styles.Arrow}/>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  item: {
    padding: 15,
    marginBottom: 10,
    borderBottomWidth:1,
     borderBottomColor: '#eee',
  },
  text: { fontSize: 18,fontWeight:"bold" },
  subject:{
  flexDirection:"row",
  justifyContent:"space-between"
  },
 Arrow:{
  width:30,
  height:30
 }
});
