import apiClient from './apiClient';

// The profile endpoint is under /users/ relative to the apiClient's baseURL (/api)
// So, the full path will be /api/users/profile/

const getUserProfile = async () => {
  // The token will be automatically attached by the apiClient's request interceptor
  const response = await apiClient.get('/users/profile/');
  // This should return the current authenticated user's profile details
  // Based on UserProfileView, this returns UserProfile data.
  // If UserDetailSerializer is used in the view for request.user, it will return more.
  return response.data;
};

const updateUserProfile = async (profileData) => {
    // profileData is expected to be { interests, location }
    const response = await apiClient.put('/users/profile/', profileData);
    return response.data;
}


const userService = {
  getUserProfile,
  updateUserProfile,
};

export default userService;
