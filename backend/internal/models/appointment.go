package models

import (
	"time"
)

// Appointment represents a scheduled appointment in the system
type Appointment struct {
	ID          string  `json:"id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description *string `json:"description,omitempty" db:"description"`
	Date        string  `json:"date" db:"date"`
	Time        string  `json:"time" db:"time"`

	// Relationships
	ClientID   string  `json:"client_id" db:"client_id"`
	PropertyID *string `json:"property_id,omitempty" db:"property_id"`
	BrokerID   string  `json:"broker_id" db:"broker_id"`

	// Classification
	Type   string `json:"type" db:"type"`
	Status string `json:"status" db:"status"`

	// Denormalized fields for performance
	ClientName      *string `json:"client_name,omitempty" db:"client_name"`
	ClientPhone     *string `json:"client_phone,omitempty" db:"client_phone"`
	PropertyAddress *string `json:"property_address,omitempty" db:"property_address"`
	BrokerName      *string `json:"broker_name,omitempty" db:"broker_name"`
	BrokerCity      *string `json:"broker_city,omitempty" db:"broker_city"`

	// Timestamps
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// CreateAppointmentRequest represents the data required for creating an appointment
type CreateAppointmentRequest struct {
	Title       string  `json:"title" validate:"required,min=5,max=255"`
	Description *string `json:"description,omitempty"`
	Date        string  `json:"date" validate:"required,datetime=2006-01-02"`
	Time        string  `json:"time" validate:"required,datetime=15:04"`
	ClientID    string  `json:"client_id" validate:"required,uuid"`
	PropertyID  *string `json:"property_id,omitempty" validate:"omitempty,uuid"`
	Type        string  `json:"type" validate:"required,oneof=site_visit meeting call"`
}

// UpdateAppointmentRequest represents the data that can be updated
type UpdateAppointmentRequest struct {
	Title       *string `json:"title,omitempty" validate:"omitempty,min=5,max=255"`
	Description *string `json:"description,omitempty"`
	Date        *string `json:"date,omitempty" validate:"omitempty,datetime=2006-01-02"`
	Time        *string `json:"time,omitempty" validate:"omitempty,datetime=15:04"`
	ClientID    *string `json:"client_id,omitempty" validate:"omitempty,uuid"`
	PropertyID  *string `json:"property_id,omitempty" validate:"omitempty,uuid"`
	Type        *string `json:"type,omitempty" validate:"omitempty,oneof=site_visit meeting call"`
	Status      *string `json:"status,omitempty" validate:"omitempty,oneof=scheduled completed cancelled"`
}

// AppointmentStats represents appointment statistics for a broker
type AppointmentStats struct {
	TotalThisMonth        int            `json:"total_this_month"`
	TodayAppointments     int            `json:"today_appointments"`
	ScheduledAppointments int            `json:"scheduled_appointments"`
	CompletedAppointments int            `json:"completed_appointments"`
	CancelledAppointments int            `json:"cancelled_appointments"`
	AppointmentsByType    map[string]int `json:"appointments_by_type"`
}

// AppointmentFilters represents query filters for appointments
type AppointmentFilters struct {
	Status    *string
	Date      *string
	Type      *string
	ClientID  *string
	StartDate *string
	EndDate   *string
}
