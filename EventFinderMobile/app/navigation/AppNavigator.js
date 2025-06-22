// EventFinderMobile/app/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppNavigator = () => {
  const { isAuthenticated, isLoading, token, user } = useSelector(state => state.auth);

  // Determine if it's the very initial loading phase (e.g., app start, token being loaded)
  // We consider it initial loading if isLoading is true AND we don't have a token or user yet.
  // This prevents the loading screen from showing during other 'isLoading' states like during login/register attempts
  // if a user was already viewing the auth screen.
  const isInitialLoading = isLoading && token === null && user === null;


  if (isInitialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AppNavigator;
