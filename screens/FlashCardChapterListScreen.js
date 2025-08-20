import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function FlashCardChapterListScreen({ route, navigation }) {
  const { subjectId, subjectName } = route.params;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subject_chapter')
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter(
          item =>
            item.relationships.parent.data &&
            item.relationships.parent.data[0].id === subjectId
        );
        setChapters(filtered);
        setLoading(false);
      });
  }, [subjectId]);

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={chapters}
      keyExtractor={item => item.id}
      ListHeaderComponent={<Text style={{fontSize:20, fontWeight:'bold',padding:14}}>{subjectName}</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('FlashCardPdf', {
            chapter: item
          })}
          style={{padding:16, borderBottomWidth:1, borderColor:'#eee'}}
        >
          <Text style={{fontSize:16}}>{item.attributes.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
