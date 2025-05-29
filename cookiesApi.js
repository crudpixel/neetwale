import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://studyneet.crudpixel.tech',
  withCredentials: true,
});

export const logoutUser = async ({ navigation }) => {
  try {
    const userData = await AsyncStorage.getItem('user');
    const userObj = JSON.parse(userData);

    const logoutToken = userObj?.logout_token;

    if (!logoutToken) {
      throw new Error('Logout token missing');
    }

    // Logout using token
    await api.post(`/user/logout?_format=json&token=${logoutToken}`);

    console.log('Logged out and session cleared');
    await AsyncStorage.removeItem('user');
    navigation.replace('Home');
  } catch (err) {
    console.warn('Logout failed:', err.response?.data || err.message);
  }
};

export default api;
