import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Paper, Box, Button, CircularProgress, Alert } from '@mui/material';
import { fetchEventByIdThunk, clearCurrentEvent, resetEventStatus } from '../../src/features/events/eventSlice';
import { format } from 'date-fns';

const EventDetailPage = () => {
  const { id: eventId } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, isLoading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventByIdThunk(eventId));
    }
    // Cleanup function: runs when component unmounts or eventId changes
    return () => {
      dispatch(clearCurrentEvent());
      dispatch(resetEventStatus());
    };
  }, [dispatch, eventId]);

  if (isLoading) {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">
            Error fetching event: {typeof error === 'object' ? JSON.stringify(error) : error}
          </Alert>
          <Button variant="outlined" component={RouterLink} to="/" sx={{ mt: 2 }}>
            Back to All Events
          </Button>
        </Container>
    );
  }

  if (!currentEvent) {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Event Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Sorry, we couldn't find the event you're looking for.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/">
              Back to All Events
            </Button>
          </Paper>
        </Container>
    );
  }

  // Formatting date and time safely
  let formattedDate = currentEvent.date;
  if (currentEvent.date) {
    try {
      formattedDate = format(new Date(`${currentEvent.date}T00:00:00`), 'MMMM d, yyyy');
    } catch (e) {
      console.error("Error formatting date:", e);
    }
  }

  let formattedTime = currentEvent.time;
  if (currentEvent.time) {
    try {
      const timeParts = currentEvent.time.split(':');
      const dateForTime = new Date();
      dateForTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0);
      formattedTime = format(dateForTime, 'p');
    } catch (e) {
      console.error("Error formatting time:", e);
    }
  }

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {currentEvent.name}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Date: {formattedDate}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Time: {formattedTime}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Location: {currentEvent.location}
            </Typography>
          </Box>
          {currentEvent.creator_username && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                Created by: {currentEvent.creator_username}
              </Typography>
          )}
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {currentEvent.description}
          </Typography>
          {currentEvent.tags && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Tags: <em>{currentEvent.tags}</em>
              </Typography>
          )}
          <Button variant="outlined" component={RouterLink} to="/" sx={{ mt: 3 }}>
            Back to All Events
          </Button>
        </Paper>
      </Container>
  );
};

export default EventDetailPage;