import { createBrowserRouter } from 'react-router-dom'

import Signup from '../pages/signup'

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Signup />,
  }
])

export default router