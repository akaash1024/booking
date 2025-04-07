import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert, Snackbar } from '@mui/material';
import axios from 'axios';

const Bookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const pageStyles = {
    mainContainer: {
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white'
    },
    title: {
      textAlign: 'center',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      background: 'linear-gradient(45deg, #FFF 30%, #90caf9 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    bookingCard: {
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    },
    cancelButton: {
      background: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
      boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
      color: 'white',
      marginTop: '1rem',
      '&:hover': {
        background: 'linear-gradient(45deg, #d32f2f 30%, #e53935 90%)',
      }
    },
    noBookings: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '1.2rem',
      marginTop: '2rem'
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`http://localhost:5000/api/seats/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to fetch your bookings');
      setShowAlert(true);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(
        `http://localhost:5000/api/seats/cancel/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchMyBookings();
      setSuccess('Booking cancelled successfully!');
      setShowAlert(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to cancel booking');
      setShowAlert(true);
    }
  };

  return (
    <Box sx={pageStyles.mainContainer}>
      <Typography variant="h3" sx={pageStyles.title}>
        My Bookings
      </Typography>

      {myBookings.length === 0 ? (
        <Typography sx={pageStyles.noBookings}>
          You don't have any bookings yet
        </Typography>
      ) : (
        myBookings.map(booking => (
          <Paper key={booking._id} sx={pageStyles.bookingCard}>
            <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>
              Booking ID: {booking._id}
            </Typography>
            <Typography sx={{ color: 'white', mb: 1 }}>
              Seats: {booking.seats.map(s => s.seatNumber).join(', ')}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Booking Date: {new Date(booking.createdAt).toLocaleString()}
            </Typography>
            <Button 
              sx={pageStyles.cancelButton}
              onClick={() => handleCancelBooking(booking._id)}
            >
              Cancel Booking
            </Button>
          </Paper>
        ))
      )}

      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowAlert(false)}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings; 