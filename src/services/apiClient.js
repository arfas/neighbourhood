import axios from 'axios';

// Define the base URL for the API.
// It's good practice to have this in an environment variable for different environments (dev, prod).
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// The common prefix for all backend API routes is /api, as defined in Django urls.py
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // e.g. http://localhost:8000/api
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      // For Django REST Framework's TokenAuthentication, the header is "Token [token_value]"
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (for global error handling, e.g., 401 unauthorized)
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Handle 401 errors globally, e.g., redirect to login, dispatch logout action
//       // store.dispatch(logoutUserAction()); // Example if you can access store here
//       console.error("Unauthorized request, logging out or redirecting...");
//       localStorage.removeItem('token'); // Ensure token is cleared
//       // window.location.href = '/login'; // Force redirect
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
