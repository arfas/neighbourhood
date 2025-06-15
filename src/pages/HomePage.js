import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsThunk, resetEventStatus } from '../../src/features/events/eventSlice'; // Adjusted path
import EventCard from '../components/EventCard'; // Adjusted path

const HomePage = () => {
  const dispatch = useDispatch();
  const { events, isLoading, error } = useSelector((state) => state.events);

  const [locationFilter, setLocationFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');

  // Fetch initial events on component mount
  useEffect(() => {
    dispatch(fetchEventsThunk({})); // Pass empty object for no initial filters

    // Cleanup: Reset event status (errors, etc.) when component unmounts
    return () => {
      dispatch(resetEventStatus());
    };
  }, [dispatch]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const queryParams = {};
    if (locationFilter) queryParams.location = locationFilter;
    if (tagsFilter) queryParams.tags = tagsFilter;
    dispatch(fetchEventsThunk(queryParams));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upcoming Events
        </Typography>
      </Box>

      {/* Filtering UI */}
      <Box component="form" onSubmit={handleFilterSubmit} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
        <TextField
          label="Filter by Location"
          variant="outlined"
          size="small"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <TextField
          label="Filter by Tags (comma-separated)"
          variant="outlined"
          size="small"
          value={tagsFilter}
          onChange={(e) => setTagsFilter(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          Apply Filters
        </Button>
      </Box>

      {/* Event Listing */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching events: {typeof error === 'object' ? JSON.stringify(error) : error}
        </Alert>
      )}
      {!isLoading && !error && events.length === 0 && (
        <Typography variant="subtitle1" sx={{ textAlign: 'center', my: 3 }}>
          No events found. Try adjusting your filters or check back later!
        </Typography>
      )}
      {!isLoading && !error && events.length > 0 && (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
