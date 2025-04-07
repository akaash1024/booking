import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Paper, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios';

const SeatLayout = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myBookings, setMyBookings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [suggestedSeats, setSuggestedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState('');

  const pageStyles = {
    mainContainer: {
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white'
    },
    sectionCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
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
    quickBooking: {
      background: 'linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%)',
      padding: '2rem',
      borderRadius: '10px',
      marginBottom: '2rem'
    },
    inputField: {
      '& .MuiOutlinedInput-root': {
        color: 'white',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.8)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#90caf9',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      }
    },
    findSeatsButton: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      padding: '0 30px',
      height: '45px',
      '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
      }
    },
    seatGrid: {
      marginTop: '2rem'
    },
    rowLabel: {
      color: '#90caf9',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    seat: {
      width: '100%',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    availableSeat: {
      background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
      color: 'white',
      boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
    },
    selectedSeat: {
      background: 'linear-gradient(45deg, #1976D2 30%, #64B5F6 90%)',
      color: 'white',
      boxShadow: '0 0 15px rgba(25, 118, 210, 0.7)'
    },
    bookedSeat: {
      background: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
      color: 'white',
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    myBookedSeat: {
      background: 'linear-gradient(45deg, #FFA726 30%, #FFB74D 90%)',
      color: 'white',
      boxShadow: '0 0 15px rgba(255, 167, 38, 0.7)'
    },
    suggestedSeat: {
      background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
      color: 'white',
      boxShadow: '0 0 15px rgba(156, 39, 176, 0.7)'
    },
    bookingCard: {
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    legend: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '2rem',
      padding: '1rem',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '10px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    legendBox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px'
    }
  };

  useEffect(() => {
    fetchSeats();
    fetchMyBookings();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/seats');
      setSeats(response.data);
    } catch (err) {
      setError('Failed to fetch seats');
      setShowAlert(true);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/seats/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      setError('This seat is already booked');
      setShowAlert(true);
      return;
    }

    setSelectedSeats(prev => {
      const newSelection = prev.includes(seat.seatNumber)
        ? prev.filter(num => num !== seat.seatNumber)
        : [...prev, seat.seatNumber];

      // Check if all selected seats are in the same row
      const selectedSeatsData = seats.filter(s => newSelection.includes(s.seatNumber));
      const rows = new Set(selectedSeatsData.map(s => s.rowNumber));
      
      if (rows.size > 1) {
        setError('Please select seats from the same row');
        setShowAlert(true);
        return prev;
      }

      if (newSelection.length > 7) {
        setError('You can book maximum 7 seats at a time');
        setShowAlert(true);
        return prev;
      }

      return newSelection;
    });
  };

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      setShowAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/seats/book',
        { seatNumbers: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If the server suggests different seats
      if (response.data.seatNumbers && 
          !selectedSeats.every(seat => response.data.seatNumbers.includes(seat))) {
        setSuggestedSeats(response.data.seatNumbers);
        setShowConfirmDialog(true);
        return;
      }

      setSelectedSeats([]);
      fetchSeats();
      fetchMyBookings();
      setSuccess('Seats booked successfully!');
      setShowAlert(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book seats');
      setShowAlert(true);
    }
  };

  const handleConfirmSuggestedSeats = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/seats/book',
        { seatNumbers: suggestedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedSeats([]);
      setSuggestedSeats([]);
      setShowConfirmDialog(false);
      fetchSeats();
      fetchMyBookings();
      setSuccess('Seats booked successfully!');
      setShowAlert(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book seats');
      setShowAlert(true);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/seats/cancel/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSeats();
      fetchMyBookings();
      setSuccess('Booking cancelled successfully!');
      setShowAlert(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      setShowAlert(true);
    }
  };

  const handleAutoSelectSeats = async () => {
    const numSeats = parseInt(numberOfSeats);
    
    if (isNaN(numSeats) || numSeats <= 0) {
      setError('Please enter a valid number of seats');
      setShowAlert(true);
      return;
    }

    if (numSeats > 7) {
      setError('You can book maximum 7 seats at a time');
      setShowAlert(true);
      return;
    }

    try {
      // Find best available row with consecutive seats
      const availableSeats = findBestAvailableSeats(numSeats);
      
      if (!availableSeats) {
        setError('No consecutive seats available for the requested number');
        setShowAlert(true);
        return;
      }

      setSuggestedSeats(availableSeats.map(seat => seat.seatNumber));
      setShowConfirmDialog(true);
    } catch (err) {
      setError('Failed to find available seats');
      setShowAlert(true);
    }
  };

  const findBestAvailableSeats = (numSeats) => {
    // Group available seats by row
    const rowMap = new Map();
    seats.forEach(seat => {
      if (!seat.isBooked) {
        if (!rowMap.has(seat.rowNumber)) {
          rowMap.set(seat.rowNumber, []);
        }
        rowMap.get(seat.rowNumber).push(seat);
      }
    });

    // Find first row with enough consecutive seats
    for (let row = 1; row <= 12; row++) {
      const availableSeats = rowMap.get(row) || [];
      availableSeats.sort((a, b) => a.seatNumber - b.seatNumber);
      if (availableSeats.length >= numSeats) {
        return availableSeats.slice(0, numSeats);
      }
    }

    return null;
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);
    const isBooked = seat.isBooked;
    const isMyBooking = myBookings.some(booking => 
      booking.seats.some(s => s.seatNumber === seat.seatNumber)
    );
    const isSuggested = suggestedSeats.includes(seat.seatNumber);

    let seatStyle = { ...pageStyles.seat };
    if (isBooked) {
      seatStyle = { ...seatStyle, ...pageStyles.bookedSeat };
      if (isMyBooking) {
        seatStyle = { ...seatStyle, ...pageStyles.myBookedSeat };
      }
    } else if (isSuggested) {
      seatStyle = { ...seatStyle, ...pageStyles.suggestedSeat };
    } else if (isSelected) {
      seatStyle = { ...seatStyle, ...pageStyles.selectedSeat };
    } else {
      seatStyle = { ...seatStyle, ...pageStyles.availableSeat };
    }

    return (
      <Grid item xs={1} key={seat.seatNumber}>
        <Paper
          elevation={3}
          sx={seatStyle}
          onClick={() => handleSeatClick(seat)}
        >
          {seat.seatNumber}
        </Paper>
      </Grid>
    );
  };

  const renderRow = (rowNumber) => {
    const rowSeats = seats.filter(seat => seat.rowNumber === rowNumber);
    return (
      <Box key={rowNumber} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Row {rowNumber}
        </Typography>
        <Grid container spacing={2}>
          {rowSeats.map(seat => renderSeat(seat))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={pageStyles.mainContainer}>
      <Typography variant="h3" sx={pageStyles.title}>
        Train Seat Reservation
      </Typography>
      
      <Box sx={pageStyles.sectionCard}>
        <Typography variant="h5" gutterBottom sx={{ color: '#90caf9' }}>
          Quick Booking
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Number of Seats"
            type="number"
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(e.target.value)}
            inputProps={{ min: 1, max: 7 }}
            sx={{ ...pageStyles.inputField, width: 150 }}
          />
          <Button
            sx={pageStyles.findSeatsButton}
            onClick={handleAutoSelectSeats}
            disabled={!numberOfSeats}
          >
            Find Best Seats
          </Button>
        </Box>
      </Box>
      
      <Box sx={pageStyles.sectionCard}>
        <Typography variant="h5" gutterBottom sx={{ color: '#90caf9' }}>
          My Bookings
        </Typography>
        {myBookings.length === 0 ? (
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>No bookings yet</Typography>
        ) : (
          myBookings.map(booking => (
            <Paper key={booking._id} sx={pageStyles.bookingCard}>
              <Typography sx={{ color: 'white' }}>
                Booking ID: {booking._id}
              </Typography>
              <Typography sx={{ color: 'white', mt: 1 }}>
                Seats: {booking.seats.map(s => s.seatNumber).join(', ')}
              </Typography>
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancel Booking
              </Button>
            </Paper>
          ))
        )}
      </Box>

      <Box sx={pageStyles.sectionCard}>
        <Typography variant="h5" gutterBottom sx={{ color: '#90caf9' }}>
          Seat Layout
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
          Click on seats to select manually, or use the Quick Booking above
        </Typography>
        
        <Box sx={pageStyles.legend}>
          <Box sx={pageStyles.legendItem}>
            <Box sx={{ ...pageStyles.legendBox, ...pageStyles.availableSeat }} />
            <Typography>Available</Typography>
          </Box>
          <Box sx={pageStyles.legendItem}>
            <Box sx={{ ...pageStyles.legendBox, ...pageStyles.selectedSeat }} />
            <Typography>Selected</Typography>
          </Box>
          <Box sx={pageStyles.legendItem}>
            <Box sx={{ ...pageStyles.legendBox, ...pageStyles.bookedSeat }} />
            <Typography>Booked</Typography>
          </Box>
          <Box sx={pageStyles.legendItem}>
            <Box sx={{ ...pageStyles.legendBox, ...pageStyles.myBookedSeat }} />
            <Typography>Your Booking</Typography>
          </Box>
          <Box sx={pageStyles.legendItem}>
            <Box sx={{ ...pageStyles.legendBox, ...pageStyles.suggestedSeat }} />
            <Typography>Suggested</Typography>
          </Box>
        </Box>

        <Box sx={pageStyles.seatGrid}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(rowNumber => renderRow(rowNumber))}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={pageStyles.findSeatsButton}
            onClick={handleBookSeats}
            disabled={selectedSeats.length === 0}
          >
            Book Selected Seats ({selectedSeats.length})
          </Button>
        </Box>
      </Box>

      <Dialog 
        open={showConfirmDialog} 
        onClose={() => setShowConfirmDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: '#90caf9' }}>Suggested Seats Available</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'white' }}>
            {selectedSeats.length > 0 
              ? 'The seats you selected are not available in the same row. Would you like to book the following seats instead?'
              : 'We found the following best available seats for you:'}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, color: '#90caf9' }}>
            Suggested seats: {suggestedSeats.join(', ')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowConfirmDialog(false);
              setSuggestedSeats([]);
              setNumberOfSeats('');
            }}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSuggestedSeats} 
            sx={pageStyles.findSeatsButton}
          >
            Book Suggested Seats
          </Button>
        </DialogActions>
      </Dialog>

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

export default SeatLayout; 