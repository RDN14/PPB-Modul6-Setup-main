# Backend API Documentation

## Overview

This is the backend API server for the PPB Module 6 sensor monitoring application. It provides REST API endpoints for sensor readings, threshold management, and user authentication.

## Features

- 🔐 JWT-based authentication
- 📊 Sensor reading management with pagination
- ⚙️ Threshold configuration
- 👤 User registration and login
- 🔒 Protected routes with authentication middleware
- 🗄️ Supabase PostgreSQL database

## Tech Stack

- **Node.js** with ES modules
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database and client
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Setup

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```env
PORT=5000
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

3. Run the database schema in Supabase SQL editor:
```bash
# Execute the SQL in supabase/schema.sql
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication

#### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Sensor Readings

#### List Readings (with Pagination)
```
GET /api/readings?page=1&limit=10

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "temperature": 25.5,
      "threshold_value": 30.0,
      "recorded_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Get Latest Reading
```
GET /api/readings/latest

Response (200):
{
  "id": "uuid",
  "temperature": 25.5,
  "threshold_value": 30.0,
  "recorded_at": "2024-01-01T00:00:00Z"
}
```

#### Create Reading
```
POST /api/readings
Content-Type: application/json

{
  "temperature": 25.5,
  "threshold_value": 30.0
}

Response (201):
{
  "id": "uuid",
  "temperature": 25.5,
  "threshold_value": 30.0,
  "recorded_at": "2024-01-01T00:00:00Z"
}
```

### Thresholds

#### List Thresholds
```
GET /api/thresholds

Response (200):
[
  {
    "id": "uuid",
    "value": 30.0,
    "note": "Summer threshold",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Latest Threshold
```
GET /api/thresholds/latest

Response (200):
{
  "id": "uuid",
  "value": 30.0,
  "note": "Summer threshold",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create Threshold (Protected)
```
POST /api/thresholds
Authorization: Bearer {token}
Content-Type: application/json

{
  "value": 30.0,
  "note": "Summer threshold"
}

Response (201):
{
  "id": "uuid",
  "value": 30.0,
  "note": "Summer threshold",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Authentication

### Using JWT Tokens

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer your-jwt-token-here
```

Tokens are obtained from `/api/auth/register` or `/api/auth/login` endpoints and are valid for 7 days (configurable via `JWT_EXPIRES_IN` env variable).

### Protected Routes

- `POST /api/thresholds` - Requires authentication

### Public Routes

All GET endpoints are public to support guest mode:
- `GET /api/readings`
- `GET /api/readings/latest`
- `GET /api/thresholds`
- `GET /api/thresholds/latest`

## Error Responses

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid credentials)
- `403` - Forbidden (invalid or expired token)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Testing

See [API_TESTING.md](./API_TESTING.md) for detailed testing instructions and examples using curl.

## Security

See [SECURITY.md](./SECURITY.md) for security considerations and best practices.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabaseClient.js      # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── readingsController.js  # Readings endpoints
│   │   └── thresholdsController.js # Thresholds endpoints
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication middleware
│   ├── models/
│   │   ├── userModel.js           # User database operations
│   │   ├── readingsModel.js       # Readings database operations
│   │   └── thresholdsModel.js     # Thresholds database operations
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── readingsRoutes.js      # Readings routes
│   │   └── thresholdsRoutes.js    # Thresholds routes
│   ├── utils/
│   │   └── jwtUtils.js            # JWT helper functions
│   └── index.js                   # Application entry point
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Development

The codebase uses ES modules (import/export) and follows a clean MVC-like architecture:

- **Controllers** - Handle HTTP requests/responses and business logic
- **Models** - Database operations and data access
- **Routes** - Define API endpoints and apply middleware
- **Middleware** - Reusable functions for authentication, validation, etc.
- **Utils** - Helper functions and utilities

## License

ISC
