
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, resetAuthStatus } from '../../src/features/auth/authSlice'; // Adjusted path

const ProfilePage = () => {
  // Local state for form fields
  const [localUsername, setLocalUsername] = useState(''); // Username usually not editable here, display from user object
  const [localInterests, setLocalInterests] = useState('');
  const [localLocation, setLocalLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const dispatch = useDispatch();
  const {
    user, // This should contain { id, username, email, profile: { interests, location } } or similar
    token,
    isProfileLoading, // Specific loading for profile actions
    error,
    isSuccess // General success flag, might need a more specific one for profile update
  } = useSelector((state) => state.auth);

  // Effect to fetch profile if not available or on initial load with token
  useEffect(() => {
    // If user data is not loaded but we are authenticated (token exists), fetch it.
    // This handles direct navigation to /profile or page refresh.
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
    // Cleanup auth status (errors, success messages) when component unmounts
    return () => {
      dispatch(resetAuthStatus());
    };
  }, [dispatch, token, user]);

  // Effect to populate local form state when user data is loaded from Redux
  useEffect(() => {
    if (user) {
      setLocalUsername(user.username || 'N/A'); // Assuming username is at user.username
      // The backend UserProfileView needs to return UserDetailSerializer for user.profile to exist here as expected.
      // Current UserProfileView returns UserProfileSerializer {interests, location} which means user object itself is this.
      // Let's adjust based on current UserProfileView which returns profile directly.
      // So, user from selector might be {interests, location} if fetchUserProfile gets that.
      // OR, if fetchUserProfile returns UserDetailSerializer, then user.profile.interests is correct.
      // Assuming fetchUserProfile is adjusted to return UserDetailSerializer data as `user`
      if (user.profile) {
        setLocalInterests(user.profile.interests || '');
        setLocalLocation(user.profile.location || '');
      } else {
        // If user object from Redux is directly the profile data {interests, location}
        // This scenario happens if /api/users/profile/ returns UserProfileSerializer data
        // and fetchUserProfile stores that directly into state.auth.user
        setLocalInterests(user.interests || '');
        setLocalLocation(user.location || '');
      }
    }
  }, [user]);

  // Effect to handle success state for profile update
  useEffect(() => {
    if (isSuccess && successMessage) { // Check for our local successMessage to ensure it's from profile update
      const timer = setTimeout(() => {
        setSuccessMessage(''); // Clear message after some time
        dispatch(resetAuthStatus()); // Reset general success flag in Redux
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, successMessage, dispatch]);


  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage(''); // Clear previous messages
    dispatch(resetAuthStatus()); // Clear previous error/success states from other operations

    const profileData = {
      interests: localInterests,
      location: localLocation,
    };
    dispatch(updateUserProfile(profileData))
      .unwrap() // Use unwrap to handle promise here for immediate feedback
      .then(() => {
        setSuccessMessage("Profile updated successfully!");
        // Optionally re-fetch profile if backend doesn't return updated object or for consistency
        // dispatch(fetchUserProfile());
      })
      .catch((updateError) => {
        // Error is already set in Redux state by rejected thunk, but can handle specific logic here if needed
        console.error("Failed to update profile:", updateError);
      });
  };

  if (isProfileLoading && !user) { // Show page-level loader only if user data isn't there yet
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
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
        {/* Display username - assuming it's available at user.username */}
        {user && user.username && (
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Username: {user.username} (Not editable here)
          </Typography>
        )}
        {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ width: '100%', mt: 1 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"

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

            value={localInterests}
            onChange={(e) => setLocalInterests(e.target.value)}
            placeholder="e.g., Hiking, Coding, Reading"

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

            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            placeholder="e.g., City, Country"

            placeholder="City, Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}

          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}

            disabled={isProfileLoading} // Disable button while profile is being updated/fetched
          >
            {isProfileLoading ? <CircularProgress size={24} /> : 'Update Profile'}

          >
            Update Profile

          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
