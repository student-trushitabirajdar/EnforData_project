package services

import (
	"fmt"

	"enfor-data-backend/internal/models"
	"enfor-data-backend/internal/repository"
)

// PropertyService handles business logic for property operations
type PropertyService struct {
	propertyRepo *repository.PropertyRepository
	userRepo     *repository.UserRepository
}

// NewPropertyService creates a new PropertyService instance
func NewPropertyService(propertyRepo *repository.PropertyRepository, userRepo *repository.UserRepository) *PropertyService {
	return &PropertyService{
		propertyRepo: propertyRepo,
		userRepo:     userRepo,
	}
}

// CreateProperty creates a new property with business logic validation
func (s *PropertyService) CreateProperty(req *models.CreatePropertyRequest, brokerID string) (*models.Property, error) {
	// Validate type-specific requirements
	if err := s.validatePropertyTypeRequirements(req); err != nil {
		return nil, err
	}

	// Fetch broker information from user repository
	broker, err := s.userRepo.GetUserByID(brokerID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch broker information: %w", err)
	}

	// Create property model from request
	property := &models.Property{
		Title:       req.Title,
		Type:        req.Type,
		ListingType: req.ListingType,
		Price:       req.Price,
		Area:        req.Area,
		Bedrooms:    req.Bedrooms,
		Bathrooms:   req.Bathrooms,
		Location:    req.Location,
		Address:     req.Address,
		City:        req.City,
		State:       req.State,
		Description: req.Description,
		Amenities:   req.Amenities,
		Status:      "available", // Default status
		BrokerID:    brokerID,
	}

	// Populate broker information
	brokerName := fmt.Sprintf("%s %s", broker.FirstName, broker.LastName)
	property.BrokerName = &brokerName
	property.BrokerCity = &broker.City

	// Handle amenities array - ensure it's not nil
	if property.Amenities == nil {
		property.Amenities = []string{}
	}

	// Create property in repository
	if err := s.propertyRepo.Create(property); err != nil {
		return nil, fmt.Errorf("failed to create property: %w", err)
	}

	return property, nil
}

// GetBrokerProperties retrieves all properties for a specific broker
func (s *PropertyService) GetBrokerProperties(brokerID string) ([]models.Property, error) {
	properties, err := s.propertyRepo.GetByBrokerID(brokerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get broker properties: %w", err)
	}

	return properties, nil
}

// validatePropertyTypeRequirements validates type-specific requirements
func (s *PropertyService) validatePropertyTypeRequirements(req *models.CreatePropertyRequest) error {
	// For apartments and houses, bedrooms and bathrooms are required
	if req.Type == "apartment" || req.Type == "house" {
		if req.Bedrooms == nil {
			return fmt.Errorf("bedrooms are required for property type '%s'", req.Type)
		}
		if req.Bathrooms == nil {
			return fmt.Errorf("bathrooms are required for property type '%s'", req.Type)
		}
		
		// Validate positive values
		if *req.Bedrooms < 0 {
			return fmt.Errorf("bedrooms must be a positive number")
		}
		if *req.Bathrooms < 0 {
			return fmt.Errorf("bathrooms must be a positive number")
		}
	}

	// For commercial and plot, bedrooms and bathrooms are optional
	// No additional validation needed for these types

	return nil
}
