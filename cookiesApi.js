import axios from 'axios';

// Create a base API instance
const api = axios.create({
  baseURL: 'https://neet.crudpixel.tech',
  withCredentials: true, // Send cookies
});

export const logoutUser = async () => {
  console.log("i am running");

  try {
    // 1. Get CSRF token
    const tokenRes = await api.get('/session/token');
    const csrfToken = tokenRes.data;

    console.log(csrfToken)

    // 2. Send logout with token in query string
    await api.post(`/user/logout?csrf_token=${csrfToken}`, null, {
      headers: {
        // Optionally include the token here too
        'X-CSRF-Token': csrfToken,
      },
    });

    console.log('Logged out and session cleared');
  } catch (err) {
    console.warn('Logout failed', err.response?.data || err.message);
  }
};


export default api;