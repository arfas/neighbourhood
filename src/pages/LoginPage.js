import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, resetAuthStatus } from '../../src/features/auth/authSlice'; // Adjusted path

const LoginPage = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState(''); // Backend might support login with username or email
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isAuthenticated, isLoading, error, isSuccess } = useSelector((state) => state.auth);

    useEffect(() => {
        // If login was successful (token received) and user details not yet fetched
        if (isSuccess && token && !user) {
            dispatch(fetchUserProfile());
        }
        // If authenticated and user details are now available, navigate
        if (isAuthenticated && user) {
            dispatch(resetAuthStatus()); // Reset success flag
            navigate('/profile'); // Or to '/' or a dashboard
        }
        // If there was an error during fetchUserProfile or login, it will be in 'error'
        // The resetAuthStatus in the return will clear isSuccess on unmount or if deps change before success
        return () => {
            if(isSuccess || error) { // Reset status if page is left after success/error
                dispatch(resetAuthStatus());
            }
        }
    }, [isSuccess, isAuthenticated, token, user, dispatch, navigate, error]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');
        if (!usernameOrEmail || !password) {
            setFormError("Username/Email and Password are required.");
            return;
        }
        // Assuming backend uses 'username' for login field with obtain_auth_token
        const credentials = { username: usernameOrEmail, password };
        dispatch(loginUser(credentials));
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
                    Login
                </Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{typeof error === 'object' ? JSON.stringify(error) : error}</Alert>}
                {formError && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{formError}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="usernameOrEmail" // Changed id for clarity
                        label="Username or Email"
                        name="usernameOrEmail"
                        autoComplete="email" // Or "username"
                        autoFocus
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    {/* Add Link to Register page if desired */}
                    {/* <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;