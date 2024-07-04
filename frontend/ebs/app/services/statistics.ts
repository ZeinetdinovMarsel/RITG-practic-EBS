import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5183',
  withCredentials: true,
});

export const getBookingsStatistics = async () => {
  try {
    const response = await api.get('/statistics/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings statistics:', error);
    throw error;
  }
};

export const getAttendanceStatistics = async () => {
  try {
    const response = await api.get('/statistics/attendance');
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    throw error;
  }
};
