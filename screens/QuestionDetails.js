import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const QuestionDetails = ({route}) => {
  const [data, setData] = useState(null);
  const { width } = useWindowDimensions(); 
  const nid = route.params.nid;
  console.log(nid)

  useEffect(() => {
    fetch(`https://studyneet.crudpixel.tech/api/student-question/${nid}`) // Replace 28 with dynamic nid if needed
      .then(res => res.json())
      .then(json => setData(json.data))
      .catch(err => console.error('Error fetching question:', err));
  }, []);

  if (!data) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Question Description</Text>
      <Text style={styles.description}>{data.field_descriptions}</Text>

      <Text style={styles.heading}>Comments</Text>
      {data.comments && data.comments.length > 0 ? (
        data.comments.map(comment => (
          <View key={comment.cid} style={styles.commentBox}>
            <Text style={styles.subject}>Subject: {comment.subject}</Text>
            <Text style={styles.author}>Student: {comment.author}</Text>
            <RenderHTML
              contentWidth={width}
              source={{ html: comment.comment_body }}
              baseStyle={styles.commentBody}
            />
          </View>
        ))
      ) : (
        <Text style={styles.noComments}>No comments yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  commentBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  subject: {
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontStyle: 'italic',
    marginBottom: 6,
  },
  commentBody: {
    fontSize: 15,
    color: '#333',
  },
  noComments: {
    fontStyle: 'italic',
    color: '#777',
  },
});

export default QuestionDetails;
