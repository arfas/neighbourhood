// EventFinderMobile/app/screens/Main/ProfileScreen.js
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, fetchUserProfile, resetAuthStatus } from '../../store/features/auth/authSlice'; // Adjust path

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isLoading, error, token } = useSelector((state) => state.auth);

  // Attempt to fetch profile if user is null but we are authenticated (e.g. direct navigation or state loss)
  // This useEffect is a fallback. Ideally, user object is already there if isAuthenticated is true.
  useEffect(() => {
    if (!user && token) {
      // Check if not already loading to prevent multiple dispatches if component re-renders while loading
      if(!isLoading) {
        dispatch(fetchUserProfile(token));
      }
    }
  }, [user, token, dispatch, isLoading]);

  // Clear errors when screen is focused or unmounts
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (error) { // Only reset if there was an error shown from a previous profile fetch attempt
        dispatch(resetAuthStatus());
      }
    });
    return unsubscribe;
  }, [navigation, dispatch, error]);


  const handleLogout = () => {
    dispatch(logoutUser());
    // Navigation to Auth flow is handled by AppNavigator reacting to isAuthenticated state change
  };

  if (isLoading && !user) { // Show loading only if user data is not yet available
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error && !user) { // Show error if user data failed to load
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading profile: {typeof error === 'object' ? JSON.stringify(error) : error}</Text>
        <Button title="Retry" onPress={() => token && dispatch(fetchUserProfile(token))} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    );
  }

  if (!user) {
    // This case might occur if navigation happens before user data is ready or if there was an issue not caught by isLoading/error.
    // Or if token was invalid and cleared, leading to logout (AppNavigator should handle this).
    return (
      <View style={styles.container}>
        <Text>No user data available. You might be logged out.</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.userInfo}>Username: {user.username}</Text>
      <Text style={styles.userInfo}>Email: {user.email}</Text>
      {/* Display other user info from user.profile if available, e.g., user.profile.interests */}
      {user.profile && user.profile.interests && Array.isArray(user.profile.interests) && <Text style={styles.userInfo}>Interests: {user.profile.interests.join(', ')}</Text>}
      {user.profile && user.profile.interests && !Array.isArray(user.profile.interests) && <Text style={styles.userInfo}>Interests: {user.profile.interests}</Text>}
      {user.profile && user.profile.location && <Text style={styles.userInfo}>Location: {user.profile.location}</Text>}

      {isLoading && <ActivityIndicator size="small" color="#0000ff" style={{marginTop: 10}} /> }
      {error && <Text style={styles.errorText}>Error during profile update/refresh: {typeof error === 'object' ? JSON.stringify(error) : error}</Text>}

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default ProfileScreen;
