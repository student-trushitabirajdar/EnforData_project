# Makefile for Enfor Data Backend

.PHONY: help run build test clean deps migrate docker-build docker-run

# Default target
help:
	@echo "Available commands:"
	@echo "  run          - Run the application in development mode"
	@echo "  build        - Build the application binary"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  deps         - Download dependencies"
	@echo "  migrate      - Run database migrations"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run application in Docker"

# Run the application
run:
	@echo "Starting Enfor Data Backend..."
	go run cmd/server/main.go

# Build the application
build:
	@echo "Building application..."
	go build -o bin/enfor-data-backend cmd/server/main.go

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	go clean

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	go mod download
	go mod tidy

# Run database migrations (requires running database)
migrate:
	@echo "Running database migrations..."
	go run cmd/server/main.go --migrate-only

# Docker commands
docker-build:
	@echo "Building Docker image..."
	docker build -t enfor-data-backend .

docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 --env-file config.env enfor-data-backend

# Development setup
dev-setup:
	@echo "Setting up development environment..."
	go mod download
	@echo "Creating uploads directory..."
	mkdir -p uploads
	@echo "Setup complete! Run 'make run' to start the server."

# Production build
prod-build:
	@echo "Building for production..."
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-w -s' -o bin/enfor-data-backend cmd/server/main.go

# Check code quality
lint:
	@echo "Running linter..."
	golangci-lint run

# Format code
fmt:
	@echo "Formatting code..."
	go fmt ./...
