import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { theme } from './theme/theme';
import Navbar from './components/Navbar';
import {
  HomePage,
  // LoginPage, // Will be removed
  // RegisterPage, // Will be removed
  AuthPage, // Added
  ProfilePage,
  CreateEventPage,
  EventDetailPage
} from './pages';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}
export default App;
