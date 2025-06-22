// EventFinderMobile/app/screens/Auth/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetAuthStatus } from '../../store/features/auth/authSlice'; // Adjust path

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear errors when screen is focused or unmounts
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(resetAuthStatus());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert('Registration Successful', 'You can now login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      dispatch(resetAuthStatus()); // Reset success flag after showing alert
    }
  }, [isSuccess, dispatch, navigation]);

  const handleRegister = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords don't match!");
      return;
    }
    // Profile data can be added here if fields are included in the form
    // const profileData = {};
    // if (interests) profileData.interests = interests;
    dispatch(registerUser({ username, email, password /*, profile: profileData */ }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        {error && <Text style={styles.errorText}>{typeof error === 'object' ? JSON.stringify(error) : error}</Text>}
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Register" onPress={handleRegister} />
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchButton} disabled={isLoading}>
          <Text style={styles.switchButtonText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
  switchButton: { marginTop: 20 },
  switchButtonText: { color: 'blue' },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' }
});

export default RegisterScreen;
