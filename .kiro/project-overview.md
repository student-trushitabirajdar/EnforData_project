# ENFOR DATA - Project Overview

## Project Description
A comprehensive real estate broker platform that connects brokers, channel partners, and clients across India. The platform provides property management, client communication, and business analytics tools.

## 📁 Organized Project Structure

```
EnforData_project/
├── src/                          # React frontend source
├── backend/                      # Go backend source  
├── scripts/                      # Startup and utility scripts
│   ├── linux/                    # Linux/macOS scripts
│   └── windows/                  # Windows scripts
├── docs/                         # Documentation
├── .kiro/                        # Kiro IDE configuration
├── public/                       # Static assets
├── start.sh / start.bat          # Quick start scripts
├── README.md                     # Main documentation
├── .gitignore                    # Git ignore rules
└── LICENSE                       # MIT License
```

## Current Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Database**: Supabase integration (configured but not actively used)
- **Authentication**: Custom JWT-based auth context

### Backend (Go)
- **Framework**: Gin HTTP framework
- **Database**: PostgreSQL with migrations
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Profile photo upload with validation
- **Architecture**: Clean architecture with handlers, services, repositories

## Current Features

### Authentication System ✅
- User registration (brokers, channel partners, admin roles)
- JWT-based login/logout
- Role-based access control
- Profile management with photo upload
- Password hashing with bcrypt

### User Interface ✅
- Landing page with feature highlights
- Responsive authentication forms
- Dashboard layout with sidebar navigation
- Basic broker dashboard with mock statistics

### Database Schema ✅
- Users table with comprehensive profile fields
- Support for Indian contact numbers (WhatsApp, alternative, foreign)
- Address fields (location, city, state, postal code)
- Profile verification and activation status

## Placeholder/Mock Features (Need Implementation)

### 1. Property Management System 🚧
- **Current**: PropertiesView component with placeholder
- **Needs**: Full CRUD operations, property details, image uploads, search/filter

### 2. WhatsApp Integration 🚧
- **Current**: WhatsAppView component with placeholder
- **Needs**: WhatsApp Business API integration, message templates, bulk messaging

### 3. Client Management (CRM) 🚧
- **Current**: ClientsView component with placeholder
- **Needs**: Lead management, client profiles, communication history, pipeline tracking

### 4. Appointment Scheduling 🚧
- **Current**: AppointmentsView component with placeholder
- **Needs**: Calendar integration, property viewing scheduling, notifications

### 5. Analytics & Reporting 🚧
- **Current**: Mock statistics in dashboard
- **Needs**: Real business metrics, performance tracking, revenue analytics

## Technical Stack Details

### Dependencies
- **Frontend**: React, TypeScript, TailwindCSS, Lucide React, Supabase client
- **Backend**: Go, Gin, PostgreSQL driver, JWT-go, bcrypt, CORS middleware

### API Endpoints (Implemented)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile
- `POST /api/upload/profile-photo` - Upload profile photo
- Role-specific dashboard endpoints (placeholder)

### Database Tables
- **users**: Complete user profiles with business information
- **migrations**: Database version control

## Development Environment
- **Frontend**: Vite dev server on port 3000 (default)
- **Backend**: Go server on port 8080
- **Database**: PostgreSQL with connection pooling
- **File Storage**: Local uploads directory

## Security Features
- JWT token authentication
- Password hashing with salt
- CORS protection
- File upload validation (type and size)
- Input validation and sanitization

## Potential Next Features

### High Priority
1. **Property Management System** - Core business functionality
2. **Client Management (CRM)** - Lead tracking and conversion
3. **WhatsApp Integration** - Client communication automation

### Medium Priority
4. **Appointment Scheduling** - Property viewing management
5. **Document Management** - Contracts and property documents
6. **Analytics Dashboard** - Business insights and reporting

### Low Priority
7. **Multi-language Support** - Hindi and regional languages
8. **Mobile App** - React Native or PWA
9. **Payment Integration** - Commission tracking and payments
10. **Advanced Search** - AI-powered property matching

## Business Context
- **Target Market**: Real estate brokers and channel partners in India
- **Key Features**: Property listings, client management, WhatsApp marketing
- **Revenue Model**: Subscription-based with tiered features
- **Competitive Advantage**: WhatsApp integration and broker network connectivity

## Technical Debt & Improvements
- Replace mock data with real API calls
- Implement proper error handling and loading states
- Add comprehensive input validation
- Set up automated testing (unit and integration)
- Implement proper logging and monitoring
- Add database indexing for performance
- Set up CI/CD pipeline