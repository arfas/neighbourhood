import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  if (!event) return null;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', m: 1 }}> {/* Adjusted for grid layout and consistent height */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event.date} at {event.time}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {event.location}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ mt: 1,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3, // Show 3 lines of description
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: 60 // Approximate height for 3 lines
        }}>
          {event.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/event/${event.id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};
export default EventCard;
