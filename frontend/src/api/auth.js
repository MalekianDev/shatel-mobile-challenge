import api from "./index";
import Cookies from 'js-cookie';

export const login = async (credentials) => {
  try {
    const response = await api.post('auth/token/', credentials);
    const { access, refresh } = response.data;
    
    // Store access token in memory/state for immediate use
    Cookies.set('token', access, {
      sameSite: 'strict',
      expires: 1
    });
    
    Cookies.set('refreshToken', refresh, {
      sameSite: 'strict',
      httpOnly: true,
      path: '/api/auth',
      expires: 7
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const refreshToken = async () => {
  try {
    const refresh = Cookies.get('refreshToken');
    const response = await api.post('auth/token/refresh/', { refresh });
    const { access } = response.data;
    
    // Update access token
    Cookies.set('token', access, {
      sameSite: 'strict',
      expires: 1
    });
    
    return access;
  } catch (error) {
    // If refresh fails, logout user
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post(`v1/accounts/user/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};