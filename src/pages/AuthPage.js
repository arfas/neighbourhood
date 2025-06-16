// src/pages/AuthPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress, Tabs, Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, resetAuthStatus, registerUser } from '../../src/features/auth/authSlice';

const AuthPage = () => {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isAuthenticated, isLoading, error, isSuccess } = useSelector((state) => state.auth);

    // --- Login States ---
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginFormError, setLoginFormError] = useState('');

    // --- Register States ---
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [interests, setInterests] = useState('');
    const [location, setLocation] = useState('');
    const [registerFormError, setRegisterFormError] = useState('');

    // Effect for Login
    useEffect(() => {
        if (authMode === 'login') {
            if (isSuccess && token && !user && !isLoading) {
                 // This condition means loginUser was successful (isSuccess true), token received,
                 // user object not yet in state, and not currently loading something else.
                dispatch(fetchUserProfile());
            }
            if (isAuthenticated && user && isSuccess) {
                // This means user is authenticated, user object is available, and the last operation was successful.
                // Typically, this follows fetchUserProfile.
                dispatch(resetAuthStatus());
                navigate('/profile');
            }
        }
    }, [isSuccess, isAuthenticated, token, user, dispatch, navigate, authMode, isLoading]);

    // Effect for Register
    useEffect(() => {
        if (authMode === 'register' && isSuccess && !isLoading) {
            // This means registerUser was successful
            alert('Registration successful! Please switch to Login or use the Login tab.'); // Simple alert for now
            dispatch(resetAuthStatus());
            // Optionally switch to login tab automatically:
            // setAuthMode('login');
            // Clear specific register fields if not switching mode automatically
            // (handleModeChange already clears fields if mode is switched)
            setUsername('');
            setEmail('');
            setRegisterPassword('');
            setConfirmPassword('');
            setInterests('');
            setLocation('');
            setRegisterFormError('');
        }
    }, [isSuccess, authMode, dispatch, isLoading]);


    const handleModeChange = (event, newMode) => {
        if (newMode !== null && newMode !== authMode) {
            setAuthMode(newMode);
            dispatch(resetAuthStatus());
            // Clear all form fields and errors
            setUsernameOrEmail('');
            setLoginPassword('');
            setLoginFormError('');
            setUsername('');
            setEmail('');
            setRegisterPassword('');
            setConfirmPassword('');
            setInterests('');
            setLocation('');
            setRegisterFormError('');
        }
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        dispatch(resetAuthStatus());
        setLoginFormError('');
        if (!usernameOrEmail || !loginPassword) {
            setLoginFormError("Username/Email and Password are required.");
            return;
        }
        const credentials = { username: usernameOrEmail, password: loginPassword };
        dispatch(loginUser(credentials));
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        dispatch(resetAuthStatus());
        setRegisterFormError('');
        if (registerPassword !== confirmPassword) {
            setRegisterFormError("Passwords don't match!");
            return;
        }
        if (!username || !email || !registerPassword) {
            setRegisterFormError("Username, Email and Password are required.");
            return;
        }

        const profileData = {};
        if (interests) profileData.interests = interests.split(',').map(interest => interest.trim());
        if (location) profileData.location = location;

        const userData = {
            username,
            email,
            password: registerPassword,
            profile: Object.keys(profileData).length > 0 ? profileData : undefined, // Use undefined if profileData is empty
        };
        dispatch(registerUser(userData));
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
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', marginBottom: 2 }}>
                    <Tabs value={authMode} onChange={handleModeChange} variant="fullWidth" aria-label="Authentication tabs">
                        <Tab label="Login" value="login" />
                        <Tab label="Register" value="register" />
                    </Tabs>
                </Box>

                {error && <Alert severity="error" sx={{ width: '100%', mt: 1, mb: 1 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</Alert>}

                {authMode === 'login' && (
                    <>
                        <Typography component="h1" variant="h5" sx={{mb:1}}>
                            Login
                        </Typography>
                        {loginFormError && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{loginFormError}</Alert>}
                        <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="usernameOrEmail"
                                label="Username or Email"
                                name="usernameOrEmail"
                                autoComplete="email"
                                autoFocus={authMode === 'login'} // Conditionally apply autoFocus
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="loginPassword"
                                label="Password"
                                type="password"
                                id="loginPassword"
                                autoComplete="current-password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </Box>
                    </>
                )}

                {authMode === 'register' && (
                    <>
                        <Typography component="h1" variant="h5" sx={{mb:1}}>
                           Register
                        </Typography>
                        {registerFormError && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{registerFormError}</Alert>}
                        <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="registerUsername"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus={authMode === 'register'} // Conditionally apply autoFocus
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
                                name="registerPassword"
                                label="Password"
                                type="password"
                                id="registerPassword"
                                autoComplete="new-password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
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
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default AuthPage;
