import apiClient from './apiClient'; // Import the new Axios instance

// The register and login endpoints are under /users/ relative to the apiClient's baseURL (/api)
// So, the full paths will be /api/users/register/ and /api/users/login/

const register = async (userData) => {
  // userData is { username, email, password, profile: { interests, location } }
  const response = await apiClient.post('/users/register/', userData);
  return response.data;
};

const login = async (credentials) => {
  // credentials is { username, password }
  const response = await apiClient.post('/users/login/', credentials);
  // DRF obtain_auth_token view returns { token: "your_token_here" }
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  // If backend had a token invalidation endpoint, it would be called here using apiClient
  // e.g., apiClient.post('/users/logout/');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
