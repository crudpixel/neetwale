import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView ,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
export default function SetsScreen({ route, navigation }) {
  const { subject } = route.params;
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(userData => {
        if (!userData) throw new Error('User not found');
        const userObj = JSON.parse(userData);
        const userId = userObj.userid;

        // Step 1: Fetch payment status
        return fetch('https://studyneet.crudpixel.tech/api/razorpay/payment-data')
          .then(res => res.json())
          .then(paymentData => {
            const userPayments = paymentData.filter(p => p.user_id === String(userId) && p.status === 'success');
            setHasPaid(userPayments.length > 0);
            console.log(userPayments.length > 0)
            // Step 2: Now fetch the sets
            return fetch(`https://studyneet.crudpixel.tech/jsonapi/taxonomy_term/subjects?filter[parent.name]=${subject}`);
          });
      })
      .then(res => res.json())
      .then(data => {
        const formatted = data.data
          .filter(item => item?.attributes?.name)
          .map(item => {
            const rawDesc = item.attributes?.description?.value || '';
            const timer = rawDesc.replace(/<\/?[^>]+(>|$)/g, '');
            return {
              id: item.id,
              name: item.attributes.name,
              timer: timer.trim(),
            };
          });
        setSets(formatted);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [subject]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <View  >
        {sets.map((set, index) => {
          const isLocked = !hasPaid && index > 0;

          return (
            <TouchableOpacity
              key={set.id}
              style={[styles.card, isLocked && styles.lockedCard]}
              onPress={() => {
                if (isLocked) {
                  Alert.alert(
                    'Locked Set',
                    'Please purchase a plan to unlock this set.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Buy Now', onPress: () => navigation.navigate('PayNow') }
                    ]
                  );
                } else {
                  navigation.navigate('Questions', { setId: set.id, timer: set.timer });
                }
              }}
            >
              <View style={styles.cardContent}>
                <View style={styles.sets}>
                {isLocked && <Image source={require('../asstes/padlock.png')} style={styles.icon}/>}
                <Text style={[styles.cardText, isLocked && styles.lockedText]}>
                  {set.name}
                </Text>
                </View>
                <Image source={require('../asstes/chevron.png')} style={styles.icon}/>

              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
   backgroundColor:"#fff",
   padding:10
  },
  card: {

    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 10,
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor: '#eee',
    
  },
  sets:{
  flexDirection:"row",
  gap:20
  },
  icon:{
  width:30,
  height:30
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",

  }
});
