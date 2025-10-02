# Contributing to ENFOR DATA

Thank you for your interest in contributing to ENFOR DATA! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd EnforData_project
```

2. **Quick start**
```bash
# Linux/macOS
./start.sh

# Windows
start.bat
```

3. **Manual setup** (see README.md for detailed instructions)

## 📁 Project Structure

```
EnforData_project/
├── src/                          # Frontend React/TypeScript code
│   ├── components/               # Reusable UI components
│   ├── context/                  # React context providers
│   ├── services/                 # API clients and external services
│   └── types/                    # TypeScript type definitions
├── backend/                      # Backend Go code
│   ├── cmd/server/               # Application entry point
│   ├── internal/                 # Internal packages
│   │   ├── handlers/             # HTTP request handlers
│   │   ├── middleware/           # HTTP middleware
│   │   ├── models/               # Data models and validation
│   │   ├── repository/           # Database access layer
│   │   └── services/             # Business logic layer
│   ├── migrations/               # Database schema migrations
│   └── config.env                # Backend configuration
├── scripts/                      # Development and deployment scripts
│   ├── linux/                    # Linux/macOS scripts
│   └── windows/                  # Windows scripts
├── docs/                         # Documentation files
└── .kiro/                        # Kiro IDE configuration
```

## 🛠 Development Workflow

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Install dependencies
go mod tidy

# Run development server
go run cmd/server/main.go

# Build binary
go build -o enfor-backend cmd/server/main.go

# Run tests
go test ./...
```

## 🎯 Contribution Guidelines

### Code Style

**Frontend (TypeScript/React):**
- Use TypeScript for all new code
- Follow React functional component patterns
- Use proper TypeScript types and interfaces
- Follow ESLint configuration
- Use Tailwind CSS for styling

**Backend (Go):**
- Follow Go standard formatting (`go fmt`)
- Use proper error handling
- Write meaningful variable and function names
- Add comments for exported functions
- Follow the existing architecture patterns

### Git Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
4. **Commit with descriptive messages**
```bash
git commit -m "feat: add property search functionality"
git commit -m "fix: resolve authentication token expiry issue"
git commit -m "docs: update API documentation"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**

### Commit Message Format

Use conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Reference related issues

## 🧪 Testing

### Frontend Testing
```bash
# Run tests (when implemented)
npm test

# Run E2E tests (when implemented)
npm run test:e2e
```

### Backend Testing
```bash
cd backend
go test ./...
```

## 📝 Documentation

- Update README.md for significant changes
- Add inline code comments for complex logic
- Update API documentation for new endpoints
- Include setup instructions for new dependencies

## 🐛 Bug Reports

When reporting bugs, please include:
- Operating system and version
- Node.js and Go versions
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Error messages and logs

## 💡 Feature Requests

For new features:
- Describe the use case and problem it solves
- Provide mockups or examples if applicable
- Consider the impact on existing functionality
- Discuss implementation approach

## 🔧 Development Environment

### Recommended Tools

- **Code Editor**: Visual Studio Code
- **Database**: pgAdmin for PostgreSQL management
- **API Testing**: Postman or similar
- **Git Client**: Command line or GUI client

### VS Code Extensions

- Go extension
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## 📊 Performance Guidelines

- Optimize database queries
- Use proper indexing
- Implement caching where appropriate
- Minimize bundle size for frontend
- Follow React performance best practices

## 🔐 Security Considerations

- Never commit sensitive data (passwords, API keys)
- Validate all user inputs
- Use proper authentication and authorization
- Follow OWASP security guidelines
- Keep dependencies updated

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in pull request discussions
- Follow the project's communication channels

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to ENFOR DATA! 🚀