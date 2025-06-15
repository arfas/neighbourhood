import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        EventsApp
      </Typography>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/login">Login</Button>
      <Button color="inherit" component={Link} to="/register">Register</Button>
      <Button color="inherit" component={Link} to="/profile">Profile</Button>
      <Button color="inherit" component={Link} to="/create-event">Create Event</Button>
    </Toolbar>
  </AppBar>
);
export default Navbar;
