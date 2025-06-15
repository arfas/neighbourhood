
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, resetAuthStatus } from '../../src/features/auth/authSlice'; // Adjusted path
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Optional profile fields, can be left blank
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      // Optionally show a success message for a few seconds before redirecting
      alert('Registration successful! Please login.'); // Simple alert for now
      dispatch(resetAuthStatus()); // Reset success flag
      navigate('/login');
    }
    // Cleanup: reset status on component unmount if not redirected
    return () => {
        dispatch(resetAuthStatus());
    }
  }, [isSuccess, dispatch, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError(''); // Clear previous form error
    if (password !== confirmPassword) {
      setFormError("Passwords don't match!");
      return;
    }
    if (!username || !email || !password) {
        setFormError("Username, Email and Password are required.");
        return;
    }

    const profileData = {};
    if (interests) profileData.interests = interests;
    if (location) profileData.location = location;

    const userData = {
      username,
      email,
      password,
      profile: Object.keys(profileData).length > 0 ? profileData : null,
    };
    dispatch(registerUser(userData));


  const handleSubmit = (event) => {
    event.preventDefault();
    // Basic validation example
    if (password !== confirmPassword) {
      console.error("Passwords don't match!");
      // Handle password mismatch error, e.g., set an error state and display a message
      return;
    }
    console.log({ username, email, password });
    // Actual registration logic will be added later

  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</Alert>}
        {formError && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{formError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"

            type="email"

            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            id="interests"
            label="Interests (comma-separated)"
            name="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="location"
            label="Location (e.g., City, Country)"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Register'}

          >
            Register

          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
