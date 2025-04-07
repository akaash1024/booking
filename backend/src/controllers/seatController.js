const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Initialize seats (run once)
const initializeSeats = async () => {
  try {
    const count = await Seat.countDocuments();
    if (count === 0) {
      const seats = [];
      let seatNumber = 1;
      
      // Create 11 rows with 7 seats each
      for (let row = 1; row <= 11; row++) {
        for (let seat = 1; seat <= 7; seat++) {
          seats.push({
            seatNumber: seatNumber++,
            rowNumber: row,
            isBooked: false
          });
        }
      }
      
      // Create last row with 3 seats
      for (let seat = 1; seat <= 3; seat++) {
        seats.push({
          seatNumber: seatNumber++,
          rowNumber: 12,
          isBooked: false
        });
      }
      
      await Seat.insertMany(seats);
      console.log('Seats initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing seats:', error);
  }
};

// Helper function to find available seats in a row
const findAvailableSeatsInRow = (seats, rowNumber) => {
  return seats
    .filter(seat => seat.rowNumber === rowNumber && !seat.isBooked)
    .sort((a, b) => a.seatNumber - b.seatNumber);
};

// Helper function to find best row for booking
const findBestRowForBooking = (seats, numberOfSeats) => {
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

  // Find the first row with enough consecutive seats
  for (let row = 1; row <= 12; row++) {
    const availableSeats = rowMap.get(row) || [];
    availableSeats.sort((a, b) => a.seatNumber - b.seatNumber);
    if (availableSeats.length >= numberOfSeats) {
      return availableSeats.slice(0, numberOfSeats);
    }
  }

  return null;
};

// Get all seats
const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find().sort('seatNumber');
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId, isActive: true })
      .populate('seats', 'seatNumber rowNumber');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book seats
const bookSeats = async (req, res) => {
  try {
    const { seatNumbers } = req.body;
    const userId = req.user._id;

    // Check if trying to book more than 7 seats
    if (seatNumbers.length > 7) {
      return res.status(400).json({ 
        message: 'Cannot book more than 7 seats at a time'
      });
    }

    // Get all seats
    const allSeats = await Seat.find().sort('seatNumber');
    
    // Check if selected seats are in the same row
    const selectedSeats = allSeats.filter(seat => seatNumbers.includes(seat.seatNumber));
    const rows = new Set(selectedSeats.map(seat => seat.rowNumber));
    
    // If seats are from multiple rows or some seats are booked, find best available row
    if (rows.size > 1 || selectedSeats.some(seat => seat.isBooked)) {
      const availableSeats = findBestRowForBooking(allSeats, seatNumbers.length);
      
      if (!availableSeats) {
        return res.status(400).json({ 
          message: 'No consecutive seats available in any row'
        });
      }

      // Update the seatNumbers with the new consecutive seats
      seatNumbers.length = 0;
      availableSeats.forEach(seat => seatNumbers.push(seat.seatNumber));
    }

    // Check if seats are available
    const seats = await Seat.find({ seatNumber: { $in: seatNumbers } });
    const unavailableSeats = seats.filter(seat => seat.isBooked);
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked',
        unavailableSeats: unavailableSeats.map(seat => seat.seatNumber)
      });
    }

    // Update seats
    await Seat.updateMany(
      { seatNumber: { $in: seatNumbers } },
      { isBooked: true, bookedBy: userId }
    );

    // Create booking
    const booking = new Booking({
      user: userId,
      seats: seats.map(seat => seat._id)
    });
    await booking.save();

    // Update user's bookings
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    res.status(201).json({ 
      message: 'Seats booked successfully', 
      booking,
      seatNumbers // Return the actual booked seat numbers (might be different from requested)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update seats
    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { isBooked: false, bookedBy: null }
    );

    // Update booking status
    booking.isActive = false;
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  initializeSeats,
  getAllSeats,
  getUserBookings,
  bookSeats,
  cancelBooking
}; 