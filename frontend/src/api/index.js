import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { refreshToken } from './auth'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      if (error.response.status === 400) {
        const data = error.response.data;
        if (typeof data === 'object') {
          Object.entries(data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach(error => toast.error(`${field}: ${error}`));
            } else {
              toast.error(`${field}: ${errors}`);
            }
          });
        } else {
          toast.error('Validation error occurred');
        }
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default instance;