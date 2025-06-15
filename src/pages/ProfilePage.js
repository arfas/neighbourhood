import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const ProfilePage = () => {
  const [username, setUsername] = useState('DefaultUser'); // Initial placeholder
  const [interests, setInterests] = useState('React, JavaScript, Node.js'); // Initial placeholder
  const [location, setLocation] = useState('Anytown, USA'); // Initial placeholder

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ username, interests, location });
    // Actual profile update logic will be added later
  };

  return (
    <Container component="main" maxWidth="sm"> {/* Adjusted maxWidth for profile */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // For this example, we allow username to be edited.
            // If it shouldn't be editable, you might use:
            // InputProps={{ readOnly: true }}
            // or simply display it as Typography if it's from a non-editable source.
          />
          <TextField
            margin="normal"
            fullWidth
            id="interests"
            label="Interests (comma-separated)"
            name="interests"
            placeholder="Enter interests, comma separated"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="location"
            label="Location"
            name="location"
            placeholder="City, Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
