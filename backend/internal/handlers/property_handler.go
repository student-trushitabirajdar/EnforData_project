package handlers

import (
	"net/http"

	"enfor-data-backend/internal/models"
	"enfor-data-backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// PropertyHandler handles HTTP requests for property operations
type PropertyHandler struct {
	propertyService *services.PropertyService
	validator       *validator.Validate
}

// NewPropertyHandler creates a new PropertyHandler instance
func NewPropertyHandler(propertyService *services.PropertyService) *PropertyHandler {
	return &PropertyHandler{
		propertyService: propertyService,
		validator:       validator.New(),
	}
}

// GetProperties handles GET /api/properties - retrieves all properties for authenticated broker
func (h *PropertyHandler) GetProperties(c *gin.Context) {
	// Extract broker_id from context (set by auth middleware)
	brokerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "Authentication required",
		})
		return
	}

	// Get properties from service
	properties, err := h.propertyService.GetBrokerProperties(brokerID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Internal server error",
			Message: "Failed to retrieve properties",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Properties retrieved successfully",
		Data:    properties,
	})
}

// CreateProperty handles POST /api/properties - creates a new property
func (h *PropertyHandler) CreateProperty(c *gin.Context) {
	// Extract broker_id from context (set by auth middleware)
	brokerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "Authentication required",
		})
		return
	}

	// Parse request body
	var req models.CreatePropertyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid request body",
			Message: err.Error(),
		})
		return
	}

	// Validate request using go-playground/validator
	if err := h.validator.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Validation failed",
			Message: formatValidationErrors(err),
		})
		return
	}

	// Create property through service
	property, err := h.propertyService.CreateProperty(&req, brokerID.(string))
	if err != nil {
		// Check for specific business logic errors
		if err.Error() == "bedrooms are required for property type 'apartment'" ||
			err.Error() == "bedrooms are required for property type 'house'" ||
			err.Error() == "bathrooms are required for property type 'apartment'" ||
			err.Error() == "bathrooms are required for property type 'house'" ||
			err.Error() == "bedrooms must be a positive number" ||
			err.Error() == "bathrooms must be a positive number" {
			c.JSON(http.StatusBadRequest, ErrorResponse{
				Error:   "Validation failed",
				Message: err.Error(),
			})
			return
		}

		// Handle server errors
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Internal server error",
			Message: "Failed to create property",
		})
		return
	}

	c.JSON(http.StatusCreated, SuccessResponse{
		Message: "Property created successfully",
		Data:    property,
	})
}

// formatValidationErrors formats validator errors into a readable message
func formatValidationErrors(err error) string {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		// Return the first validation error in a user-friendly format
		if len(validationErrors) > 0 {
			field := validationErrors[0].Field()
			tag := validationErrors[0].Tag()
			
			switch tag {
			case "required":
				return field + " is required"
			case "min":
				return field + " must be at least " + validationErrors[0].Param() + " characters"
			case "max":
				return field + " must be at most " + validationErrors[0].Param() + " characters"
			case "gt":
				return field + " must be greater than " + validationErrors[0].Param()
			case "gte":
				return field + " must be greater than or equal to " + validationErrors[0].Param()
			case "oneof":
				return field + " must be one of: " + validationErrors[0].Param()
			default:
				return field + " validation failed"
			}
		}
	}
	return err.Error()
}
