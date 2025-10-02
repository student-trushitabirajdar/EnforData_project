# ENFOR DATA - Real Estate Business Platform

A comprehensive real estate broker platform that connects brokers, channel partners, and clients across India. Built with React (frontend) and Go (backend) with PostgreSQL database.

## 🌟 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Property Management**: Complete CRUD operations for property listings
- **Client Management**: CRM functionality for leads and client tracking
- **WhatsApp Integration**: Direct client communication and marketing
- **Appointment Scheduling**: Property viewing management
- **Analytics Dashboard**: Business insights and performance metrics
- **Multi-role Support**: Brokers, Channel Partners, and Admin roles

## 🏗 Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend│ ◄──────────────► │   Go Backend    │
│   (Vite + TS)   │                 │   (Gin + JWT)   │
└─────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Database      │
                                    └─────────────────┘
```

## 🚀 Quick Start

### Linux/macOS
```bash
./scripts/linux/start-enfor-data.sh
```

### Windows
```cmd
scripts\windows\start-enfor-data.bat
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Go** (v1.19 or higher)
- **PostgreSQL** (v12 or higher)

## 🛠 Installation

### Automatic Setup

**Linux/macOS:**
```bash
chmod +x scripts/linux/start-enfor-data.sh
./scripts/linux/start-enfor-data.sh
```

**Windows (PowerShell as Administrator):**
```powershell
.\scripts\windows\install-windows.ps1
.\scripts\windows\start-enfor-data.ps1
```

### Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd EnforData_project
```

2. **Setup Database**
```sql
CREATE DATABASE enfor_data;
CREATE USER backend WITH PASSWORD 'enfor_data';
GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
```

3. **Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
go mod tidy
cd ..
```

4. **Build and Run**
```bash
# Build backend
cd backend
go build -o enfor-backend cmd/server/main.go
./enfor-backend &
cd ..

# Start frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000 (or 3001/5173)
- **Backend API**: http://localhost:8080
- **API Health**: http://localhost:8080/health

## 👤 Demo Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Broker | `broker@example.com` | `password123` | John Smith - Mumbai |
| Channel Partner | `builder@example.com` | `password123` | Sarah Johnson - Delhi |
| Admin | `admin@example.com` | `password123` | Admin User - Bangalore |

## 📁 Project Structure

```
EnforData_project/
├── src/                          # React frontend source
│   ├── components/               # React components
│   ├── context/                  # React context (Auth, etc.)
│   ├── services/                 # API client and services
│   └── types/                    # TypeScript type definitions
├── backend/                      # Go backend source
│   ├── cmd/server/               # Application entry point
│   ├── internal/                 # Internal packages
│   │   ├── handlers/             # HTTP handlers
│   │   ├── middleware/           # HTTP middleware
│   │   ├── models/               # Data models
│   │   ├── repository/           # Database layer
│   │   └── services/             # Business logic
│   ├── migrations/               # Database migrations
│   └── config.env                # Backend configuration
├── scripts/                      # Startup and utility scripts
│   ├── linux/                    # Linux/macOS scripts
│   └── windows/                  # Windows scripts
├── docs/                         # Documentation
├── .kiro/                        # Kiro IDE configuration
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

**Backend:**
```bash
cd backend
go run cmd/server/main.go    # Run development server
go build -o enfor-backend cmd/server/main.go  # Build binary
go test ./...                # Run tests
```

### Management Scripts

**Linux/macOS:**
```bash
./scripts/linux/start-enfor-data.sh    # Start all services
./scripts/linux/stop-enfor-data.sh     # Stop all services
./scripts/linux/status-enfor-data.sh   # Check service status
```

**Windows:**
```cmd
scripts\windows\start-enfor-data.bat   # Start all services
scripts\windows\stop-enfor-data.ps1    # Stop all services
scripts\windows\status-enfor-data.ps1  # Check service status
```

## 🗄 Database Schema

### Users Table
- User authentication and profiles
- Role-based access control
- Business information (firm, location, etc.)
- Contact details (WhatsApp, phone, etc.)

### Future Tables
- Properties (listings, details, images)
- Clients (leads, contacts, pipeline)
- Appointments (viewings, meetings)
- Messages (WhatsApp integration)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### File Upload
- `POST /api/upload/profile-photo` - Upload profile photo

### Protected Routes
- `GET /api/broker/dashboard` - Broker dashboard
- `GET /api/channel-partner/dashboard` - Channel partner dashboard
- `GET /api/admin/dashboard` - Admin dashboard

## 🛡 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation and sanitization
- File upload validation

## 🌍 Environment Configuration

### Backend (`backend/config.env`)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=backend
DB_PASSWORD=enfor_data
DB_NAME=enfor_data
JWT_SECRET=your-secret-key
PORT=8080
```

### Frontend
- Automatically connects to `http://localhost:8080/api`
- Configurable via `src/services/api.ts`

## 📚 Documentation

- [Linux/macOS Setup Guide](docs/README-STARTUP.md)
- [Windows Setup Guide](docs/README-WINDOWS.md)
- [Windows Getting Started](docs/GETTING-STARTED-WINDOWS.txt)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Backend won't start:**
- Check PostgreSQL is running
- Verify database credentials
- Ensure port 8080 is free

**Frontend won't start:**
- Check Node.js version
- Clear `node_modules` and reinstall
- Ensure ports 3000/3001/5173 are free

**Database connection issues:**
- Verify PostgreSQL service is running
- Check database and user exist
- Verify credentials in `backend/config.env`

### Getting Help

1. Check the appropriate setup guide in `docs/`
2. Run status scripts to check service health
3. Check log files for error messages
4. Open an issue with detailed error information

---

**Built with ❤️ for the Indian Real Estate Industry**