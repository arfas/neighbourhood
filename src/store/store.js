import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice'; // Import eventReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer, // Add eventReducer to the store
  },
});
