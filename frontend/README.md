# Shatel Mobile Challenge Frontend

This is a React application built with Vite for the Shatel Mobile Challenge.

## Features

- Email bulk sending functionality
- Template selection & creation
- Bulk mailing progress monitoring with pause/resume/cancel capabilities
- Bulk mailing real-time progress tracking
- Secure user authentication using JWT (JSON Web Tokens)
- Protected routes with token-based authorization

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

Clone the repository and install the dependencies:

```bash
cd shatel-mobile-challenge/frontend
npm install
```

## Running the Application

### Development Mode

To run the application in development mode with hot module replacement (HMR):

```bash
npm run dev
```

This will start the development server, typically at http://localhost:5173

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── api/         # API service layer
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   │   └── email-bulk/  # Email bulk functionality
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Application entry point
├── index.html       # HTML template
└── vite.config.js   # Vite configuration
```

## API Integration

The application integrates with a backend API for:
- Creating bulk emails
- Monitoring email sending progress
- Controlling the email sending process (pause/resume/cancel)
- User authentication (login, signup, token refresh)

### Authentication Flow

The application uses JWT (JSON Web Tokens) for secure authentication:

1. **Login/Signup**: Users provide credentials to receive access and refresh tokens
2. **Token Storage**: Tokens are securely stored in cookies
3. **API Authorization**: Access tokens are automatically included in API requests
4. **Token Refresh**: Expired tokens are automatically refreshed using the refresh token
5. **Session Management**: Invalid sessions trigger automatic logout

### Secure API Requests

All API requests to protected endpoints include the JWT in the Authorization header:

```javascript
// Automatically handled by the API client
headers: {
  Authorization: `Bearer ${token}`
}
```

## Technologies Used

- React - UI library
- Vite - Build tool and development server
- Material UI - Component library
- Axios - HTTP client
