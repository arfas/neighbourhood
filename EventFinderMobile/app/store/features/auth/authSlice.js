// EventFinderMobile/app/store/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import authService from '../../../services/authService'; // Path from app/store/features/auth/ to app/services/

const TOKEN_KEY = 'authToken';

export const loadToken = createAsyncThunk('auth/loadToken', async (_, { dispatch }) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      await dispatch(fetchUserProfile(token));
      return token;
    }
    return null;
  } catch (e) {
    console.error('Failed to load token from secure store', e);
    return null;
  }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await dispatch(fetchUserProfile(data.token));
        return data.token;
      } else {
        return rejectWithValue('Login failed: No token received');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message || 'Login failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (tokenArg, { getState, rejectWithValue }) => {
    try {
      const tokenToUse = tokenArg || getState().auth.token;
      if (!tokenToUse) {
        return rejectWithValue('No token found, cannot fetch profile.');
      }
      const userData = await authService.getUserProfile(tokenToUse);
      return userData;
    } catch (error) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch profile, token might be invalid');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  // Optional: await authService.logoutBackend(); if you implement it
  return null;
});

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
      })
      .addCase(loadToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isSuccess = false;
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
