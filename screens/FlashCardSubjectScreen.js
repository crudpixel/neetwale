import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function FlashCardSubjectScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subject_chapter')
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter(
          item =>
            item.relationships.parent.data &&
            item.relationships.parent.data[0].id === 'virtual'
        );
        setSubjects(filtered);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={subjects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlashCardChapter', {
              subjectId: item.id,
              subjectName: item.attributes.name,
            })
          }
          style={{padding:20, borderBottomWidth:1, borderColor:'#eee'}}
        >
          <Text style={{fontSize:18}}>{item.attributes.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
