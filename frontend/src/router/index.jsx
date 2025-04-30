import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute, AnonymousRoute } from '../components/ProtectedRoute'
import Signup from '../pages/signup'
import Login from '../pages/login'

const router = createBrowserRouter([
  {
    path: '/register',
    element: (
      <AnonymousRoute>
        <Signup />
      </AnonymousRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <AnonymousRoute>
        <Login />
      </AnonymousRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <div>Protected Home Page</div>
      </ProtectedRoute>
    ),
  },
])

export default router