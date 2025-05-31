import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthorNodesList = () => {
  const [nodes, setNodes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://studyneet.crudpixel.tech/api/student-question/all?author=Prateek')
      .then(response => response.json())
      .then(json => {
        if (json.status === 'success') {
          setNodes(json.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

const renderItem = ({ item }) => (
  <View style={styles.row}>
    <Text style={[styles.cell, styles.id]}>{item.nid}</Text>
    <TouchableOpacity
      style={[styles.cell, { flex: 1 }]}
      onPress={() => navigation.navigate('QuestionDetails', { nid: item.nid })}
    >
      <Text
        style={styles.linkText}
        numberOfLines={0} // allow unlimited lines
        ellipsizeMode="tail"
      >
        {item.field_descriptions}
      </Text>
    </TouchableOpacity>
  </View>
);

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, styles.id]}>Node ID</Text>
          <Text style={[styles.cell, styles.headerCell]}>Raised Question</Text>
        </View>
        <FlatList
          data={nodes}
          keyExtractor={(item) => item.nid}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width:400
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: '#e0e0e0',
  },
cell: {
  paddingHorizontal: 8,
  fontSize: 14,
  flexShrink: 1, // allow shrinking to fit
},
  id: {
    flex: 0.3,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 15,
  },
linkText: {
  color: '#007bff',
  textDecorationLine: 'underline',
  flexWrap: 'wrap',
  width: '100%',
},
});

export default AuthorNodesList;
