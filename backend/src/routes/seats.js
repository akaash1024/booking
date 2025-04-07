const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllSeats, getUserBookings, bookSeats, cancelBooking } = require('../controllers/seatController');

// Get all seats
router.get('/', getAllSeats);

// Get user's bookings
router.get('/user/:userId', auth, getUserBookings);

// Book seats (protected route)
router.post('/book', auth, bookSeats);

// Cancel booking (protected route)
router.delete('/cancel/:bookingId', auth, cancelBooking);

module.exports = router; 