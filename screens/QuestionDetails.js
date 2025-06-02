import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuestionDetails = ({ route }) => {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const nid = route.params.nid;

  // Fetch user from AsyncStorage
  async function fetchUser() {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser.name);
    }
  }

  // Fetch question and comments
  const fetchQuestion = () => {
    fetch(`https://studyneet.crudpixel.tech/api/student-question/${nid}`)
      .then(res => res.json())
      .then(json => setData(json.data))
      .catch(err => console.error('Error fetching question:', err));
  };

  useEffect(() => {
    fetchUser();
    fetchQuestion();
  }, []);

  const handleSubmit = () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    fetch('https://studyneet.crudpixel.tech/api/student-question/comment/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nid,
        comment_body: commentText,
        userId: userId,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          Alert.alert('Success', 'Comment submitted');
          setCommentText('');
          setShowForm(false);
          fetchQuestion(); // ✅ Refresh to show new comment
        } else {
          Alert.alert('Failed', 'Something went wrong');
        }
      })
      .catch(err => {
        console.error('Error submitting comment:', err);
        Alert.alert('Error', 'Network or server error');
      });
  };

  if (!data) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Question Description</Text>
      <Text style={styles.description}>{data.field_descriptions}</Text>

      {/* Add Comment Section */}
      {!showForm ? (
        <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addCommentBtn}>
          <Text style={styles.addCommentText}>Add Your Comment</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Write your comment here..."
            style={styles.textArea}
            multiline
            numberOfLines={5}
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="Submit Comment" onPress={handleSubmit} />
        </View>
      )}

      <Text style={styles.heading}>Comments</Text>
      {data.comments && data.comments.length > 0 ? (
        data.comments.map(comment => (
          <View key={comment.cid} style={styles.commentBox}>
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
  addCommentBtn: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  addCommentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 10,
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
