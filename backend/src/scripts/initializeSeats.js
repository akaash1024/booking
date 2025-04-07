const mongoose = require('mongoose');
const Seat = require('../models/Seat');
require('dotenv').config();

const initializeSeats = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing seats
    await Seat.deleteMany({});

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
    
    // Insert all seats
    await Seat.insertMany(seats);
    console.log('Seats initialized successfully');
    
    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error initializing seats:', error);
    process.exit(1);
  }
};

initializeSeats(); 