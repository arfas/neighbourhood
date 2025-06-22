// EventFinderMobile/app/services/authService.js
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store'; // Will be used for token storage/retrieval via Redux slice

// Replace with your actual backend URL
// If using Android emulator, localhost might be 10.0.2.2
// If using physical device, it must be your computer's network IP address
const API_URL = 'http://10.0.2.2:8000/api/users/'; // Default for Android emulator accessing localhost

const apiClient = axios.create({
  baseURL: API_URL,
  // timeout: 10000, // Optional: configure timeout
});

// We will handle token storage and inclusion in headers via Redux and an Axios interceptor later,
// once Redux is set up. For now, authService focuses on basic API calls.

const register = async (userData) => {
  // userData is expected to be { username, email, password, profile: { interests, location } (optional) }
  try {
    const response = await apiClient.post('register/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error in authService:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

const login = async (credentials) => {
  // credentials is { username, password }
  try {
    const response = await apiClient.post('login/', credentials);
    // DRF obtain_auth_token view returns { token: "your_token_here" }
    // Token storage will be handled by Redux slice after this call.
    if (response.data && response.data.token) {
      return response.data; // Contains the token
    } else {
      throw new Error('Login failed: No token received');
    }
  } catch (error) {
    console.error('Login error in authService:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Logout function might involve calling a backend endpoint if you have one.
// For now, token removal will be handled in Redux slice.
// const logout = async () => {
//   // Example: await apiClient.post('logout/');
//   // Token removal from SecureStore will be in the slice.
// };

// Function to fetch user profile - needs token
// This will be more fleshed out when Redux and token interceptors are in place.
const getUserProfile = async (token) => {
  try {
    const response = await apiClient.get('profile/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get profile error in authService:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch profile');
  }
};


const authService = {
  register,
  login,
  getUserProfile,
  // logout, // Uncomment if you add a backend logout call
};

export default authService;
