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

// GetPropertyByID retrieves a property by ID with ownership verification
func (s *PropertyService) GetPropertyByID(id, brokerID string) (*models.Property, error) {
	property, err := s.propertyRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if property.BrokerID != brokerID {
		return nil, fmt.Errorf("property not found")
	}

	return property, nil
}

// UpdateProperty updates a property with ownership verification and validation
func (s *PropertyService) UpdateProperty(id string, req *models.UpdatePropertyRequest, brokerID string) (*models.Property, error) {
	property, err := s.GetPropertyByID(id, brokerID)
	if err != nil {
		return nil, err
	}

	updatedType := property.Type
	if req.Type != nil {
		updatedType = *req.Type
	}

	updatedBedrooms := property.Bedrooms
	if req.Bedrooms != nil {
		updatedBedrooms = req.Bedrooms
	}

	updatedBathrooms := property.Bathrooms
	if req.Bathrooms != nil {
		updatedBathrooms = req.Bathrooms
	}

	validationReq := &models.CreatePropertyRequest{
		Type:      updatedType,
		Bedrooms:  updatedBedrooms,
		Bathrooms: updatedBathrooms,
	}
	if err := s.validatePropertyTypeRequirements(validationReq); err != nil {
		return nil, err
	}

	if req.Title != nil {
		property.Title = *req.Title
	}
	if req.Type != nil {
		property.Type = *req.Type
	}
	if req.ListingType != nil {
		property.ListingType = *req.ListingType
	}
	if req.Price != nil {
		property.Price = *req.Price
	}
	if req.Area != nil {
		property.Area = *req.Area
	}
	if req.Bedrooms != nil {
		property.Bedrooms = req.Bedrooms
	}
	if req.Bathrooms != nil {
		property.Bathrooms = req.Bathrooms
	}
	if req.Location != nil {
		property.Location = *req.Location
	}
	if req.Address != nil {
		property.Address = *req.Address
	}
	if req.City != nil {
		property.City = *req.City
	}
	if req.State != nil {
		property.State = *req.State
	}
	if req.Description != nil {
		property.Description = *req.Description
	}
	if req.Amenities != nil {
		property.Amenities = req.Amenities
	}
	if req.Status != nil {
		property.Status = *req.Status
	}

	if property.Amenities == nil {
		property.Amenities = []string{}
	}

	if err := s.propertyRepo.Update(property); err != nil {
		return nil, fmt.Errorf("failed to update property: %w", err)
	}

	return property, nil
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
