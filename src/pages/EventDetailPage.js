import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button } from '@mui/material';

// Re-defining mockEvents here for simplicity in this UI-focused step.
// In a real app, this data would likely come from a Redux store, context, or API call.
const mockEvents = [
  { id: '1', name: 'Tech Conference 2024', date: '2024-09-10', time: '09:00', location: 'Convention Center Hall A', description: 'An annual conference bringing together leading minds in technology, innovation, and software development. Features keynote speakers, workshops, and networking opportunities.' },
  { id: '2', name: 'Community Music Festival', date: '2024-09-15', time: '14:00', location: 'Central Park Bandshell', description: 'A fun-filled day of live music from local bands, food trucks, and activities for the whole family. Free admission.' },
  { id: '3', name: 'Artisan Craft Fair', date: '2024-09-21', time: '10:00', location: 'Old Town Square', description: 'Discover unique handmade crafts, jewelry, art, and more from talented local artisans. A great place to find unique gifts.' },
  { id: '4', name: 'Startup Pitch Night', date: '2024-09-28', time: '18:30', location: 'Innovation Hub Co-working', description: 'Watch entrepreneurs pitch their latest startup ideas to a panel of investors and industry experts. Networking session to follow.' },
  { id: '5', name: 'Food & Wine Expo', date: '2024-10-05', time: '12:00', location: 'Exhibition Grounds', description: 'Sample a wide variety of culinary delights and fine wines from around the region. Cooking demonstrations and pairing workshops available.' },
  { id: '6', name: 'Charity Fun Run 5K', date: '2024-10-12', time: '08:00', location: 'Riverside Park Trail', description: 'Join us for a 5K run/walk to support local charities. All ages and fitness levels welcome. T-shirts and medals for participants.' },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {event.name}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Date: {event.date}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Time: {event.time}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Location: {event.location}
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.75 }}>
          {event.description}
        </Typography>
        <Button variant="outlined" component={RouterLink} to="/" sx={{ mt: 2 }}>
          Back to All Events
        </Button>
      </Paper>
    </Container>
  );
};

export default EventDetailPage;
