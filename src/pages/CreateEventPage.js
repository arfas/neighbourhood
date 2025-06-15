import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const CreateEventPage = () => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ eventName, description, date, time, location });
    // Actual event creation logic will be added later
  };

  return (
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="date"
            label="Event Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }} // Important for date/time input labels
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="time"
            label="Event Time"
            name="time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Event
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateEventPage;
