// EventFinderMobile/app/screens/Auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetAuthStatus } from '../../store/features/auth/authSlice'; // Adjust path

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear errors when screen is focused or unmounts
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(resetAuthStatus());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  // No need for useEffect for isAuthenticated navigation here,
  // AppNavigator handles it based on isAuthenticated state changes.

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email/Username and Password are required.");
      return;
    }
    // Assuming backend uses 'username' for login, and 'email' state here holds that value
    dispatch(loginUser({ username: email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.errorText}>{typeof error === 'object' ? JSON.stringify(error) : error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username or Email" // Changed placeholder
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchButton} disabled={isLoading}>
        <Text style={styles.switchButtonText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
  switchButton: { marginTop: 20 },
  switchButtonText: { color: 'blue' },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' }
});

export default LoginScreen;
