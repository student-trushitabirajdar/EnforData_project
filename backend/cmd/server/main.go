package main

import (
	"log"
	"net/http"

	"enfor-data-backend/internal/config"
	"enfor-data-backend/internal/database"
	"enfor-data-backend/internal/handlers"
	"enfor-data-backend/internal/middleware"
	"enfor-data-backend/internal/repository"
	"enfor-data-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)

	// Initialize database connection
	db, err := database.NewConnection(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Run database migrations
	if err := db.RunMigrations(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	propertyRepo := repository.NewPropertyRepository(db)
	clientRepo := repository.NewClientRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	propertyService := services.NewPropertyService(propertyRepo, userRepo)
	clientService := services.NewClientService(clientRepo, userRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	uploadHandler := handlers.NewUploadHandler(authService, cfg)
	propertyHandler := handlers.NewPropertyHandler(propertyService)
	clientHandler := handlers.NewClientHandler(clientService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Initialize Gin router
	router := gin.New()

	// Global middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "enfor-data-backend",
			"version": "1.0.0",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Authentication routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
		}

		// Protected routes (require authentication)
		protected := api.Group("/")
		protected.Use(authMiddleware.RequireAuth())
		{
			// User profile routes
			protected.GET("/auth/me", authHandler.GetMe)
			protected.POST("/auth/refresh", authHandler.RefreshToken)

			// File upload routes
			protected.POST("/upload/profile-photo", uploadHandler.UploadProfilePhoto)

			// Property routes (accessible to all authenticated users)
			protected.GET("/properties", propertyHandler.GetProperties)
			protected.POST("/properties", propertyHandler.CreateProperty)

			// Client routes (accessible to all authenticated users)
			protected.GET("/clients", clientHandler.GetClients)
			protected.POST("/clients", clientHandler.CreateClient)
			protected.GET("/clients/:id", clientHandler.GetClient)
			protected.PUT("/clients/:id", clientHandler.UpdateClient)
			protected.DELETE("/clients/:id", clientHandler.DeleteClient)

			// Role-specific routes
			broker := protected.Group("/broker")
			broker.Use(authMiddleware.RequireRole("broker"))
			{
				broker.GET("/dashboard", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{
						"message": "Broker dashboard",
						"user_id": c.GetString("user_id"),
					})
				})
			}

			channelPartner := protected.Group("/channel-partner")
			channelPartner.Use(authMiddleware.RequireRole("channel_partner"))
			{
				channelPartner.GET("/dashboard", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{
						"message": "Channel Partner dashboard",
						"user_id": c.GetString("user_id"),
					})
				})
			}

			admin := protected.Group("/admin")
			admin.Use(authMiddleware.RequireRole("admin"))
			{
				admin.GET("/dashboard", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{
						"message": "Admin dashboard",
						"user_id": c.GetString("user_id"),
					})
				})
			}
		}

		// File serving routes (public for uploaded files)
		api.GET("/uploads/:filename", uploadHandler.ServeUploadedFile)
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Printf("Database connected to %s:%s/%s", cfg.Database.Host, cfg.Database.Port, cfg.Database.DBName)
	log.Printf("Upload path: %s", cfg.Upload.Path)

	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
