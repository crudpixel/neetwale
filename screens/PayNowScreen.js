// PayNowScreen.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const PayNowScreen = ({navigation}) => {
 
  const handlePayment = async () => {
     const user = JSON.parse(await AsyncStorage.getItem('user'));
    const user_id = user?.userid;
    console.log(user_id)

    try {
      // 1. Call your backend to create a Razorpay order
      const response = await fetch('https://studyneet.crudpixel.tech/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1 }), // amount in INR
      });

      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        description: 'NEET Premium Plan',
        image: 'https://studyneet.crudpixel.tech/sites/default/files/Bosch.png',
        currency: order.currency,
        key: 'rzp_live_bqgaN8CIbW5Fq0', // ✅ only public key
        amount: order.amount,
        name: 'StudyNEET',
        order_id: order.order_id,
        prefill: {
          email: 'Kishangaur24@gmail.com',
          contact: '9935017500',
          name: 'Kishan',
        },
        theme: { color: '#0f62fe' },
      };

      RazorpayCheckout.open(options)
        .then(paymentData => {
          Alert.alert(
  'Payment Successful',
  'Thank you for purchasing our plan!',
  [
    {
      text: 'OK',
      onPress: () => navigation.navigate('Dashboard'), 
    },
  ],
  { cancelable: false }
);
          // Optional: Verify payment on backend here
async function userPaymentData() {
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000); // Convert to Unix timestamp in seconds
  const status = 'success'; // ✅ Define this BEFORE using it
  console.log(user_id, timestamp, order.order_id, status, order.amount, paymentData.razorpay_payment_id);

  await fetch('https://studyneet.crudpixel.tech/api/razorpay/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user_id,
      order_id: order.order_id,
      amount: order.amount,
      status: status,
      payment_date: timestamp,
      payment_id: paymentData.razorpay_payment_id,
    }),
  });
}

          userPaymentData();

        })
        .catch(error => {
          Alert.alert('Payment Failed', error.description || 'Payment cancelled');
        });
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buy NEET Premium Plan</Text>
      <Button title="Pay ₹1" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});

export default PayNowScreen;
