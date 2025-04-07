import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const pageStyles = {
    mainContainer: {
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    formContainer: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '2rem',
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      background: 'linear-gradient(45deg, #FFF 30%, #90caf9 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
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
      },
      marginBottom: '1rem'
    },
    submitButton: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      width: '100%',
      padding: '10px',
      marginTop: '1rem',
      '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post('https://booking-14ix.onrender.com/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      const { token, user } = response.data;
      login(user, token);
      navigate('/book-seats');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setShowAlert(true);
    }
  };

  return (
    <Box sx={pageStyles.mainContainer}>
      <Box sx={pageStyles.formContainer}>
        <Typography variant="h4" sx={pageStyles.title}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            sx={pageStyles.inputField}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={pageStyles.inputField}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={pageStyles.inputField}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={pageStyles.inputField}
          />
          <Button
            type="submit"
            variant="contained"
            sx={pageStyles.submitButton}
          >
            Register
          </Button>
        </form>
      </Box>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowAlert(false)}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register; 