# API Testing Guide

## Setup

1. Make sure you have a `.env` file with:
```
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

2. Run the users table creation SQL in Supabase:
```sql
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists users_email_idx
  on public.users (email);
```

3. Start the server:
```bash
npm run dev
```

## Testing Authentication Endpoints

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Expected response (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "created_at": "timestamp"
  },
  "token": "jwt-token-here"
}
```

### 2. Login with existing user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "created_at": "timestamp"
  },
  "token": "jwt-token-here"
}
```

### 3. Get user profile (protected)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response (200):
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "name": "Test User",
  "created_at": "timestamp"
}
```

### 4. Test protected threshold creation
Without token (should fail with 401):
```bash
curl -X POST http://localhost:5000/api/thresholds \
  -H "Content-Type: application/json" \
  -d '{
    "value": 25.5,
    "note": "Test threshold"
  }'
```

With token (should succeed):
```bash
curl -X POST http://localhost:5000/api/thresholds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "value": 25.5,
    "note": "Test threshold"
  }'
```

## Testing Pagination

### Get readings with pagination
```bash
# First page, 5 items per page
curl "http://localhost:5000/api/readings?page=1&limit=5"

# Second page, 10 items per page
curl "http://localhost:5000/api/readings?page=2&limit=10"
```

Expected response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 50,
    "totalPages": 10
  }
}
```

## Error Cases to Test

1. Register with existing email (should return 400)
2. Login with wrong password (should return 401)
3. Login with non-existent email (should return 401)
4. Access protected route without token (should return 401)
5. Access protected route with invalid token (should return 403)
6. Register with invalid email format (should return 400)
7. Register with password < 6 characters (should return 400)
