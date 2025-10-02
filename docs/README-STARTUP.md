# ENFOR DATA - Startup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Go** (v1.19 or higher) 
- **PostgreSQL** (v12 or higher)
- **Database Setup**: `enfor_data` database with user `backend`

### One-Command Startup

```bash
./start-enfor-data.sh
```

This script will:
- ✅ Check all prerequisites
- ✅ Install dependencies
- ✅ Build the backend server
- ✅ Start PostgreSQL database
- ✅ Start Go backend server (port 8080)
- ✅ Start React frontend server (port 3000/3001/5173)
- ✅ Verify all services are running

### Management Commands

```bash
# Start the platform
./start-enfor-data.sh

# Check status
./status-enfor-data.sh

# Stop the platform  
./stop-enfor-data.sh
```

## 🌐 Access Points

Once started, you can access:

- **Website**: http://localhost:3000 (or 3001/5173)
- **Backend API**: http://localhost:8080
- **API Health**: http://localhost:8080/health

## 👤 Demo Login Credentials

The startup script creates demo users you can use:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Broker | `broker@example.com` | `password123` | John Smith - Mumbai |
| Channel Partner | `builder@example.com` | `password123` | Sarah Johnson - Delhi |
| Admin | `admin@example.com` | `password123` | Admin User - Bangalore |

## 📊 What You'll See

### Landing Page
- Modern landing page with feature highlights
- "Get Started" button to access login/signup

### Authentication
- Login form with demo credential buttons
- Registration form for new users
- Real-time validation and error handling

### Dashboard (After Login)
- Role-based dashboard
- Property management interface
- Client management system
- WhatsApp integration panel
- Appointment scheduling

## 🛠 Manual Startup (Alternative)

If you prefer to start services manually:

### 1. Start Backend
```bash
cd backend
go build -o enfor-backend cmd/server/main.go
./enfor-backend
```

### 2. Start Frontend
```bash
npm install
npm run dev
```

## 📝 Logs and Debugging

### View Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs  
tail -f frontend.log

# Real-time status
watch ./status-enfor-data.sh
```

### Common Issues

**Backend won't start:**
- Check PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Verify database exists: `psql -h localhost -U backend -d enfor_data -c "SELECT 1;"`
- Check port 8080 is free: `lsof -i :8080`

**Frontend won't start:**
- Check Node.js version: `node --version`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check ports 3000/3001/5173 are free

**Database connection issues:**
- Ensure PostgreSQL is running
- Check credentials in `backend/config.env`
- Verify database and user exist

## 🔧 Configuration

### Backend Configuration
Edit `backend/config.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=backend
DB_PASSWORD=enfor_data
DB_NAME=enfor_data
PORT=8080
JWT_SECRET=your-secret-key
```

### Frontend Configuration
The frontend automatically connects to `http://localhost:8080/api`

## 🏗 Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend│ ◄──────────────► │   Go Backend    │
│   (Port 3000)   │                 │   (Port 8080)   │
└─────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Database      │
                                    └─────────────────┘
```

## 🎯 Next Steps

After starting the platform:

1. **Test Authentication**: Use demo credentials to login
2. **Explore Features**: Navigate through different sections
3. **Create New Users**: Test the registration flow
4. **API Testing**: Use the backend API endpoints
5. **Development**: Start building new features

## 📞 Support

If you encounter issues:

1. Run `./status-enfor-data.sh` to check service status
2. Check log files for error messages
3. Verify all prerequisites are installed
4. Ensure database is properly configured

---

**Happy coding! 🚀**