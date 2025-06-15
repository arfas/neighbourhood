import apiClient from './apiClient'; // apiClient has baseURL '/api'

// The EventViewSet is registered at 'events' relative to '/api', so '/api/events/'
const EVENTS_URL = '/events/'; // Path relative to apiClient's baseURL

const createEvent = async (eventData) => {
  // eventData should include: name, description, date, time, location, tags
  // The 'creator' field is automatically set by the backend using request.user
  const response = await apiClient.post(EVENTS_URL, eventData);
  return response.data; // DRF typically returns the created object
};

const getEvents = async (queryParams = {}) => {
  // queryParams could be { location: 'City', tags: 'tech,python' }
  const response = await apiClient.get(EVENTS_URL, { params: queryParams });
  return response.data; // Should be a list of events
};

const getEventById = async (eventId) => {
  const response = await apiClient.get(`${EVENTS_URL}${eventId}/`);
  return response.data; // Should be a single event object
};

// Placeholder for future update/delete if not using ViewSet's direct capabilities elsewhere
// const updateEvent = async (eventId, eventData) => {
//   const response = await apiClient.put(`${EVENTS_URL}${eventId}/`, eventData);
//   return response.data;
// };

// const deleteEvent = async (eventId) => {
//   const response = await apiClient.delete(`${EVENTS_URL}${eventId}/`);
//   return response.data; // Or status code
// };

const eventService = {
  createEvent,
  getEvents,
  getEventById,
  // updateEvent,
  // deleteEvent,
};

export default eventService;
