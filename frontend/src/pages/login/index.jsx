import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Container, 
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Login
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button 
                    component="a" 
                    href="/register" 
                    color="primary" 
                    sx={{ p: 0, textTransform: 'none' }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}