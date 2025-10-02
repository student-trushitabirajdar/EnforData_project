# Enfor Data Backend

A Go backend service for the Enfor Data platform providing authentication and user management for brokers and channel partners.

## Features

- **User Authentication**: JWT-based authentication system
- **Role-based Access Control**: Support for brokers, channel partners, and admin roles
- **Profile Management**: Complete user profiles with business information
- **File Upload**: Profile photo upload with validation
- **PostgreSQL Database**: Robust data storage with migrations
- **RESTful API**: Clean API design with proper error handling

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Configuration management
│   ├── database/
│   │   └── connection.go        # Database connection and migrations
│   ├── handlers/
│   │   ├── auth_handler.go      # Authentication endpoints
│   │   └── upload_handler.go    # File upload endpoints
│   ├── middleware/
│   │   ├── auth_middleware.go   # JWT authentication middleware
│   │   └── cors_middleware.go   # CORS configuration
│   ├── models/
│   │   └── user.go              # User data models
│   ├── repository/
│   │   └── user_repository.go   # Database operations
│   ├── services/
│   │   └── auth_service.go      # Business logic
│   └── utils/
│       └── jwt.go               # JWT utilities
├── migrations/
│   └── 001_create_users_table.sql
├── uploads/                     # File upload directory
├── config.env                   # Environment configuration
├── go.mod
└── README.md
```

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Git

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE enfor_data;
CREATE USER backend WITH PASSWORD 'enfor_data';
GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
```

2. The application will automatically run migrations on startup.

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Copy and configure environment variables:
```bash
cp config.env.example config.env
# Edit config.env with your settings
```

4. Run the application:
```bash
go run cmd/server/main.go
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user (broker or channel partner).

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "date_of_birth": "1990-01-01",
  "firm_name": "Doe Properties",
  "role": "broker",
  "whatsapp_number": "+91 9876543210",
  "alternative_number": "+91 9876543211",
  "foreign_number": "+1 234 567 8900",
  "address": "123 Main St, Business District",
  "location": "Business District",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "broker",
      "firm_name": "Doe Properties",
      "city": "Mumbai",
      "state": "Maharashtra",
      "is_verified": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "broker",
      "firm_name": "Doe Properties",
      "city": "Mumbai",
      "state": "Maharashtra",
      "is_verified": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Protected Endpoints (Require Authorization Header)

#### GET /api/auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "message": "User profile retrieved successfully",
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "broker",
    "firm_name": "Doe Properties",
    "city": "Mumbai",
    "state": "Maharashtra",
    "is_verified": false,
    "profile_image": "/uploads/profile-123.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/upload/profile-photo
Upload profile photo.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
Form field: profile_photo (file)
```

**Response:**
```json
{
  "message": "Profile photo uploaded successfully",
  "data": {
    "profile_image": "/uploads/profile-123.jpg"
  }
}
```

### Role-specific Endpoints

#### GET /api/broker/dashboard
Broker-only endpoint.

#### GET /api/channel-partner/dashboard
Channel partner-only endpoint.

#### GET /api/admin/dashboard
Admin-only endpoint.

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=backend
DB_PASSWORD=enfor_data
DB_NAME=enfor_data
DB_SSL_MODE=disable

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8080
GIN_MODE=debug

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## Running the Application

### Development
```bash
go run cmd/server/main.go
```

### Production Build
```bash
go build -o enfor-data-backend cmd/server/main.go
./enfor-data-backend
```

### Docker (Optional)
```bash
docker build -t enfor-data-backend .
docker run -p 8080:8080 enfor-data-backend
```

## Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### User Registration
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "date_of_birth": "1990-01-01",
    "firm_name": "Doe Properties",
    "role": "broker",
    "whatsapp_number": "+91 9876543210",
    "address": "123 Main St",
    "location": "Business District",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Middleware for role checking
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for frontend integration
- **File Upload Security**: File type and size validation

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- date_of_birth (DATE)
- firm_name (VARCHAR)
- role (VARCHAR: broker, channel_partner, admin)
- whatsapp_number (VARCHAR)
- alternative_number (VARCHAR, Optional)
- foreign_number (VARCHAR, Optional)
- address (TEXT)
- location (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- postal_code (VARCHAR)
- profile_image (VARCHAR, Optional)
- is_verified (BOOLEAN)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
