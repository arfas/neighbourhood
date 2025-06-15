import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/eventService'; // Adjust path as needed

const initialState = {
  currentEvent: null, // For viewing a single event's details
  events: [],         // For listing multiple events
  isLoading: false,
  error: null,
  isSuccess: false,   // Generic success flag, e.g., for creation
};

// Async Thunks
export const createEventThunk = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response; // This should be the newly created event object
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.detail || error.response.data)) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchEventsThunk = createAsyncThunk(
  'events/fetchEvents',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents(queryParams);
      return response; // This should be an array of event objects
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.detail || error.response.data)) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchEventByIdThunk = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventService.getEventById(eventId);
      return response; // This should be a single event object
    } catch (error) {
      const message =
        (error.response && error.response.data && (error.response.data.detail || error.response.data)) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);


const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventStatus: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isSuccess = false;
      // Do not clear currentEvent or events here unless intended
    },
    clearCurrentEvent: (state) => {
        state.currentEvent = null;
    },
    clearEventsList: (state) => {
        state.events = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Event
      .addCase(createEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentEvent = action.payload; // Store the newly created event
        // Optionally add to events list if appropriate, or let list be fetched separately
        // state.events.unshift(action.payload);
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isSuccess = false;
      })
      // Fetch Events (List)
      .addCase(fetchEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload; // Replace events list with fetched data
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Event By ID (Detail)
      .addCase(fetchEventByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentEvent = null; // Clear previous current event
      })
      .addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEventStatus, clearCurrentEvent, clearEventsList } = eventSlice.actions;
export default eventSlice.reducer;
