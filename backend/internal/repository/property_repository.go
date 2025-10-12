package repository

import (
	"database/sql"
	"fmt"

	"enfor-data-backend/internal/database"
	"enfor-data-backend/internal/models"

	"github.com/lib/pq"
)

// PropertyRepository handles database operations for properties
type PropertyRepository struct {
	db *database.DB
}

// NewPropertyRepository creates a new PropertyRepository instance
func NewPropertyRepository(db *database.DB) *PropertyRepository {
	return &PropertyRepository{db: db}
}

// Create inserts a new property into the database
// The broker_name and broker_city are automatically populated by database trigger
func (r *PropertyRepository) Create(property *models.Property) error {
	query := `
		INSERT INTO properties (
			title, type, listing_type, price, area,
			bedrooms, bathrooms, location, address, city, state,
			description, amenities, status, broker_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, broker_name, broker_city, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		property.Title,
		property.Type,
		property.ListingType,
		property.Price,
		property.Area,
		property.Bedrooms,
		property.Bathrooms,
		property.Location,
		property.Address,
		property.City,
		property.State,
		property.Description,
		pq.Array(property.Amenities), // Handle PostgreSQL array type
		property.Status,
		property.BrokerID,
	).Scan(
		&property.ID,
		&property.BrokerName,
		&property.BrokerCity,
		&property.CreatedAt,
		&property.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create property: %w", err)
	}

	return nil
}

// GetByBrokerID retrieves all properties for a specific broker
// Uses optimized composite index (broker_id, created_at DESC) for fast retrieval
func (r *PropertyRepository) GetByBrokerID(brokerID string) ([]models.Property, error) {
	query := `
		SELECT 
			id, title, type, listing_type, price, area,
			bedrooms, bathrooms, location, address, city, state,
			description, amenities, status, broker_id,
			broker_name, broker_city, created_at, updated_at
		FROM properties
		WHERE broker_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, brokerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query properties by broker ID: %w", err)
	}
	defer rows.Close()

	var properties []models.Property

	for rows.Next() {
		var property models.Property

		err := rows.Scan(
			&property.ID,
			&property.Title,
			&property.Type,
			&property.ListingType,
			&property.Price,
			&property.Area,
			&property.Bedrooms,
			&property.Bathrooms,
			&property.Location,
			&property.Address,
			&property.City,
			&property.State,
			&property.Description,
			pq.Array(&property.Amenities), // Handle PostgreSQL array type
			&property.Status,
			&property.BrokerID,
			&property.BrokerName,
			&property.BrokerCity,
			&property.CreatedAt,
			&property.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan property row: %w", err)
		}

		properties = append(properties, property)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating property rows: %w", err)
	}

	// Return empty slice instead of nil if no properties found
	if properties == nil {
		properties = []models.Property{}
	}

	return properties, nil
}

// GetByID retrieves a single property by ID
// This method does NOT validate broker ownership - that should be done at the service layer
func (r *PropertyRepository) GetByID(id string) (*models.Property, error) {
	query := `
		SELECT 
			id, title, type, listing_type, price, area,
			bedrooms, bathrooms, location, address, city, state,
			description, amenities, status, broker_id,
			broker_name, broker_city, created_at, updated_at
		FROM properties
		WHERE id = $1
	`

	var property models.Property

	err := r.db.QueryRow(query, id).Scan(
		&property.ID,
		&property.Title,
		&property.Type,
		&property.ListingType,
		&property.Price,
		&property.Area,
		&property.Bedrooms,
		&property.Bathrooms,
		&property.Location,
		&property.Address,
		&property.City,
		&property.State,
		&property.Description,
		pq.Array(&property.Amenities), // Handle PostgreSQL array type
		&property.Status,
		&property.BrokerID,
		&property.BrokerName,
		&property.BrokerCity,
		&property.CreatedAt,
		&property.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("property not found")
		}
		return nil, fmt.Errorf("failed to get property by ID: %w", err)
	}

	return &property, nil
}
