import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // For better date/time formatting

const EventCard = ({ event }) => {
  if (!event) return null;

  let formattedDate = event.date;
  if (event.date) {
    try {
      // Assuming event.date is 'YYYY-MM-DD' and event.time is 'HH:MM:SS' or 'HH:MM'
      // Create a Date object. Note: Parsing date strings directly can be tricky with timezones.
      // If date & time are separate, it's often better to combine them carefully or use a library.
      // For display, parsing just the date part for formatting is safer.
      formattedDate = format(new Date(`${event.date}T00:00:00`), 'MMM d, yyyy'); // Example: Sep 10, 2024
    } catch (e) {
      console.error("Error formatting date:", e);
      // formattedDate remains event.date
    }
  }

  let formattedTime = event.time;
  if (event.time) {
    try {
      // Crude time formatting, assumes HH:MM:SS or HH:MM
      const timeParts = event.time.split(':');
      formattedTime = `${timeParts[0]}:${timeParts[1]}`; // HH:MM
    } catch (e) {
      // formattedTime remains event.time
    }
  }


  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', m: 1 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {formattedDate} at {formattedTime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {event.location}
        </Typography>
        {event.creator_username && ( // Display creator username if available
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Created by: {event.creator_username}
          </Typography>
        )}
        <Typography variant="body2" color="text.primary" sx={{
          mt: 1,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: 60 // Ensure space even if description is short, for card consistency
        }}>
          {event.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-start', mt: 'auto' }}> {/* Align button to left, push to bottom */}
        <Button size="small" component={Link} to={`/event/${event.id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
export default EventCard;
