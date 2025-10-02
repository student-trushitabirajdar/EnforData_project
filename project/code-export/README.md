# ENFOR DATA - Real Estate Broker Platform

A comprehensive business management platform designed specifically for real estate brokers and builders to manage their daily operations, client data, property listings, and business networking.

## Features

### Core Functionality
- **Role-based Authentication**: Broker, Channel Partner, and Admin roles
- **Professional Dashboard**: Comprehensive overview with analytics and metrics
- **Property Management**: Complete property listing and management system
- **Client Management**: Detailed client profiles and relationship tracking
- **WhatsApp Marketing**: Bulk messaging, templates, and analytics
- **Appointment Scheduling**: Calendar integration with automated reminders
- **Broker Network**: Inter-city networking and referral system

### User Roles

#### Real Estate Brokers
- Property & Client Management
- WhatsApp Marketing Suite
- Broker Network & Referrals
- Appointment Scheduling
- Agreement Management

#### Channel Partners
- Project Portfolio Management
- Broker Network Access
- Lead Management System
- WhatsApp Marketing Tools
- Sales Analytics & Reports

#### Admin
- User Management and Verification
- Platform Analytics and Reporting
- WhatsApp Message Control
- System Configuration
- Support and Moderation

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Authentication**: Mock authentication (ready for backend integration)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd enfor-data-platform
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

The platform includes demo accounts for testing:

- **Broker**: broker@example.com / password123
- **Channel Partner**: builder@example.com / password123  
- **Admin**: admin@example.com / password123

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login and registration forms
│   ├── Dashboard/      # Dashboard components and stats
│   ├── Landing/        # Landing page and company info
│   ├── Layout/         # Navigation and sidebar components
│   ├── Properties/     # Property management views
│   └── WhatsApp/       # WhatsApp marketing features
├── context/
│   └── AuthContext.tsx # Authentication context and state
├── types/
│   └── index.ts        # TypeScript type definitions
└── App.tsx             # Main application component
```

## Key Components

### Landing Page
- Professional company presentation
- Role-based sign-up options
- Feature showcase and testimonials
- Company information and contact details

### Authentication System
- Role-based login and registration
- Interactive role selection
- Form validation and error handling
- Demo account integration

### Dashboard
- Role-specific dashboards
- Real-time analytics and metrics
- Property and client statistics
- WhatsApp message tracking
- Appointment management

### Property Management
- Comprehensive property listings
- Advanced search and filtering
- Property status tracking
- Image galleries and details
- CRUD operations

### WhatsApp Marketing
- Bulk message campaigns
- Message templates
- Delivery tracking and analytics
- Client segmentation
- Campaign performance metrics

## Customization

### Adding New Features
1. Create new components in the appropriate directory
2. Add routes to the sidebar navigation
3. Update type definitions as needed
4. Implement the feature logic

### Styling
The project uses Tailwind CSS for styling. Key design principles:
- Professional blue color scheme (#2563EB primary)
- Clean, modern interface design
- Responsive layout for all devices
- Consistent spacing and typography

### Backend Integration
The platform is designed for easy backend integration:
- Replace mock authentication with real API calls
- Update data fetching in components
- Add proper error handling
- Implement real-time updates

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed for ENFOR DATA.

## Support

For support and questions, contact:
- Email: contact@enfordata.com
- Phone: +91 22 4567 8900
- Address: Tower A, Business Park, Bandra Kurla Complex, Mumbai - 400051

---

**ENFOR DATA** - Empowering real estate professionals with cutting-edge technology for business growth and success.