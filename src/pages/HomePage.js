import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsThunk, resetEventStatus } from '../../src/features/events/eventSlice'; // Adjusted path
import EventCard from '../components/EventCard'; // Adjusted path

// Mock events as fallback data
const mockEvents = [
  { id: '1', name: 'Tech Conference 2024', date: '2024-09-10', time: '09:00', location: 'Convention Center Hall A', description: 'An annual conference bringing together leading minds in technology, innovation, and software development. Features keynote speakers, workshops, and networking opportunities.' },
  { id: '2', name: 'Community Music Festival', date: '2024-09-15', time: '14:00', location: 'Central Park Bandshell', description: 'A fun-filled day of live music from local bands, food trucks, and activities for the whole family. Free admission.' },
  { id: '3', name: 'Artisan Craft Fair', date: '2024-09-21', time: '10:00', location: 'Old Town Square', description: 'Discover unique handmade crafts, jewelry, art, and more from talented local artisans. A great place to find unique gifts.' },
  { id: '4', name: 'Startup Pitch Night', date: '2024-09-28', time: '18:30', location: 'Innovation Hub Co-working', description: 'Watch entrepreneurs pitch their latest startup ideas to a panel of investors and industry experts. Networking session to follow.' },
  { id: '5', name: 'Food & Wine Expo', date: '2024-10-05', time: '12:00', location: 'Exhibition Grounds', description: 'Sample a wide variety of culinary delights and fine wines from around the region. Cooking demonstrations and pairing workshops available.' },
  { id: '6', name: 'Charity Fun Run 5K', date: '2024-10-12', time: '08:00', location: 'Riverside Park Trail', description: 'Join us for a 5K run/walk to support local charities. All ages and fitness levels welcome. T-shirts and medals for participants.' },
];

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

  // Use API events if available, otherwise fallback to mock events
  const displayEvents = events.length > 0 ? events : mockEvents;

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

        {/* Loading State */}
        {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
        )}

        {/* Error State */}
        {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              Error fetching events: {typeof error === 'object' ? JSON.stringify(error) : error}
            </Alert>
        )}

        {/* No Events Found */}
        {!isLoading && !error && events.length === 0 && displayEvents.length === 0 && (
            <Typography variant="subtitle1" sx={{ textAlign: 'center', my: 3 }}>
              No events found. Try adjusting your filters or check back later!
            </Typography>
        )}

        {/* Event Listing */}
        {!isLoading && displayEvents.length > 0 && (
            <Grid container spacing={3}>
              {displayEvents.map((event) => (
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