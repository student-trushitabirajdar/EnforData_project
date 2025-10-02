#!/bin/bash

echo "🚀 Setting up Enfor Data Backend..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21 or higher."
    exit 1
fi

echo "✅ Go version: $(go version)"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed and running."
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p bin

# Download dependencies
echo "📦 Downloading Go dependencies..."
go mod download
go mod tidy

# Set executable permissions
chmod +x setup.sh

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure PostgreSQL is running with the database 'enfor_data'"
echo "2. Update config.env with your database credentials if needed"
echo "3. Run the server with: go run cmd/server/main.go"
echo "   or use: make run"
echo ""
echo "API will be available at: http://localhost:8080"
echo "Health check: http://localhost:8080/health"
echo ""
echo "Happy coding! 🎉"
