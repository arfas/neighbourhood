import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import userService from '../../services/userService'; // Import userService

// Removed axios import as direct calls are now in services

const token = localStorage.getItem('token');
// Removed getUserFromToken helper as it's not providing much value without decoding JWT or actual user data

const initialState = {
  user: null, // Will store user object { username, email, profile, etc. }
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  isProfileLoading: false, // For profile specific loading state
  error: null,
  isSuccess: false,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.detail || error.response.data)) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(credentials); // data is { token: "..." }
      // After successful login and token storage, dispatch fetchUserProfile
      if (data.token) {
        // Dispatch fetchUserProfile here to get user details
        // Note: loginUser will return data.token, and component can dispatch fetchUserProfile on success
        // Or, we can chain it here. Chaining here makes sense.
        await dispatch(fetchUserProfile()); // Wait for profile to be fetched
        return { token: data.token }; // Return token so loginUser.fulfilled sets it
      } else {
        return rejectWithValue('Login failed: No token received');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.detail || error.response.data.non_field_errors?.join(' ') || error.response.data)) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => { // No first argument needed if token from state
    try {
      // Token should be in state if loginUser was successful before this is called,
      // or if app is initializing with an existing token.
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token found, cannot fetch profile.');
      }
      const userData = await userService.getUserProfile();
      // Assuming userService.getUserProfile() returns the user object structured as:
      // { id, username, email, profile: { interests, location } } (from UserDetailSerializer)
      // OR { interests, location } if UserProfileView returns UserProfileSerializer data.
      // The backend UserProfileView currently returns UserProfileSerializer (interests, location).
      // This means `userData` will be {interests, location}.
      // We need to decide how `state.user` is structured.
      // Option 1: state.user stores the direct output of /profile/
      // Option 2: state.user stores a more complete object, requiring /profile/ to provide it or another call.
      // For now, let's assume `state.user` will store what `userService.getUserProfile()` returns.
      // If backend `/api/users/profile/` returns UserProfile data, then `action.payload` will be `{interests, location}`.
      // This is not ideal for `state.user`.
      // A better approach for backend: `/api/users/me/` returns UserDetailSerializer data.
      // For now, let's proceed assuming `userService.getUserProfile()` returns the full UserDetailSerializer data
      // (meaning UserProfileView in Django should use UserDetailSerializer and get_object should return request.user).
      // This needs backend alignment. If that's not the case, then the structure of `state.user` would be just the profile fields.
      return userData;
    } catch (error) {
      authService.logout(); // Clear token if profile fetch fails (e.g. invalid token)
      const message = (error.response && error.response.data && error.response.data.detail) || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No token found, cannot update profile.');
      }
      const updatedProfile = await userService.updateUserProfile(profileData);
      // updatedProfile is likely { interests, location }
      return updatedProfile;
    } catch (error) {
      const message = (error.response && error.response.data && (error.response.data.detail || error.response.data)) || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
      state.isProfileLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log('Registration successful, user data:', action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // User data is set by fetchUserProfile.fulfilled
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false; //isLoading for login is done, profile loading is next
        state.isSuccess = true; // For login part
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isProfileLoading = true; // Use a separate flag for profile loading
        state.error = null; // Clear previous errors
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // action.payload is the user profile data
        state.isProfileLoading = false;
        state.isAuthenticated = true; // Ensure this is set if app loads with existing token
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null; // Token is invalid or issue with fetching
        state.isAuthenticated = false;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        // Assuming action.payload is the updated profile data {interests, location}
        // And state.user is structured like { ..., profile: {interests, location}}
        // Or if state.user directly stores what /profile returns
        if (state.user) {
            // If state.user is {id, username, email, profile: {}}
            // state.user.profile = action.payload;
            // If state.user is just the profile data {interests, location}
            state.user = { ...state.user, ...action.payload }; // Merge or replace based on structure
        } else {
            // If user was null, but somehow profile updated (edge case)
            state.user = action.payload;
        }
        // Display success message or similar
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthStatus, logout } = authSlice.actions;
export default authSlice.reducer;
