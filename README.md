# Train Seat Reservation System

A full-stack application for managing train seat reservations with the following features:
- User authentication (login/register)
- Seat booking with priority for same-row booking
- Maximum 7 seats per booking
- Real-time seat availability
- Modern UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
.
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Custom middleware
│   └── package.json
└── frontend/            # React frontend
    ├── src/
    │   ├── components/  # React components
    │   └── App.jsx      # Main application
    └── package.json
```

## Setup and Running

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/train-reservation
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User Authentication:
  - Register new users
  - Login with email and password
  - Protected routes

- Seat Booking:
  - View all available seats
  - Select up to 7 seats at a time
  - Priority for booking seats in the same row
  - Real-time seat availability updates

- User Interface:
  - Modern and responsive design
  - Intuitive seat selection
  - Clear booking status indicators

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Seats
- GET /api/seats - Get all seats
- POST /api/seats/book - Book selected seats
- DELETE /api/seats/cancel/:bookingId - Cancel a booking

## Security Features

- JWT-based authentication
- Password hashing
- Protected API routes
- Input validation
- Error handling 