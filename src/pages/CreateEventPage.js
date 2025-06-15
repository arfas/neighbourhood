import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEventThunk, resetEventStatus } from '../../src/features/events/eventSlice'; // Adjusted path
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // FIXED: Removed V3 from path
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {isValid as dateIsValid, format as formatDate} from 'date-fns';


const CreateEventPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading, error, isSuccess, currentEvent } = useSelector((state) => state.events);

  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null); // Use null for DatePicker
  const [time, setTime] = useState(null); // Use null for TimePicker
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated string

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Authentication Check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/create-event' } });
    }
  }, [isAuthenticated, navigate]);

  // Handle successful event creation
  useEffect(() => {
    if (isSuccess && currentEvent) {
      setSuccessMessage(`Event "${currentEvent.name}" created successfully!`);
      // Clear form
      setEventName('');
      setDescription('');
      setDate(null);
      setTime(null);
      setLocation('');
      setTags('');
      setFormError('');

      // Navigate after a delay or provide a link
      const timer = setTimeout(() => {
        navigate(`/event/${currentEvent.id}`); // Navigate to the new event's detail page
        dispatch(resetEventStatus()); // Reset status after navigation and message
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, currentEvent, dispatch, navigate]);

  // Cleanup event status (error, success) on unmount
  useEffect(() => {
    return () => {
      dispatch(resetEventStatus());
    }
  }, [dispatch]);


  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');
    dispatch(resetEventStatus()); // Clear previous success/error states

    if (!eventName || !description || !date || !time || !location) {
      setFormError('All fields except Tags are required.');
      return;
    }
    if (!dateIsValid(date) || !dateIsValid(time)) {
      setFormError('Please enter valid date and time.');
      return;
    }

    const eventData = {
      name: eventName,
      description,
      // Format date and time to string (e.g., YYYY-MM-DD, HH:MM:SS) as expected by Django backend
      date: formatDate(date, 'yyyy-MM-dd'),
      time: formatDate(time, 'HH:mm:ss'),
      location,
      tags, // Send as comma-separated string
    };

    dispatch(createEventThunk(eventData));
  };

  // Ensure MUI X Date/Time pickers are installed:
  // npm install @mui/x-date-pickers date-fns
  // (date-fns is a peer dependency for AdapterDateFns)
  // This should have been part of MUI setup, if not, needs installation. Assuming it is.

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container component="main" maxWidth="md">
          <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Typography component="h1" variant="h5">
              Create New Event
            </Typography>
            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</Alert>}
            {formError && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{formError}</Alert>}
            {successMessage && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{successMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="eventName"
                  label="Event Name"
                  name="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  autoFocus
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Event Description"
                  name="description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              <DatePicker
                  label="Event Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
              <TimePicker
                  label="Event Time"
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="location"
                  label="Event Location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
              />
              <TextField
                  margin="normal"
                  fullWidth
                  id="tags"
                  label="Tags (comma-separated)"
                  name="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., tech, music, art"
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
              </Button>
            </Box>
          </Box>
        </Container>
      </LocalizationProvider>
  );
};

export default CreateEventPage;