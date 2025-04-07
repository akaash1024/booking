import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyles = {
    appBar: {
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    },
    navButton: {
      color: 'white',
      margin: '0 10px',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)'
      }
    },
    logo: {
      flexGrow: 1,
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
    }
  };

  return (
    <AppBar position="static" sx={navStyles.appBar}>
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          sx={navStyles.logo}
        >
          Train Booking
        </Typography>
        <Box>
          {user ? (
            <>
              <Button
                component={Link}
                to="/book-seats"
                sx={navStyles.navButton}
              >
                Book Seats
              </Button>
              <Button
                component={Link}
                to="/my-bookings"
                sx={navStyles.navButton}
              >
                My Bookings
              </Button>
              <Button
                onClick={handleLogout}
                sx={navStyles.navButton}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={navStyles.navButton}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={navStyles.navButton}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 