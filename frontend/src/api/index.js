import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle validation errors (400)
      if (error.response.status === 400) {
        const data = error.response.data
        // Handle validation errors format
        if (typeof data === 'object') {
          Object.entries(data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach(error => toast.error(`${field}: ${error}`))
            } else {
              toast.error(`${field}: ${errors}`)
            }
          })
        } else {
          toast.error('Validation error occurred')
        }
      }
      // Handle authentication errors
      if (error.response.status === 401 || error.response.status === 403) {
        Cookies.remove('token')
        toast.error('Authentication failed. Please login again.')
      }
    } else {
      // Handle network errors
      toast.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default instance