package types

import "github.com/google/uuid"

type UserAssistance struct {
	//user id in header
	Latitude  float64   `json:"latitude" validate:"required"`
	Longitude float64   `json:"longitude" validate:"required"`
	VehicleID uuid.UUID `json:"vehicleId" validate:"required"`
	Images    []string  `json:"images" validate:"required"`
}

type DestinationAssistance struct {
	Latitude    float64 `json:"latitude" validate:"required"`
	Longitude   float64 `json:"longitude" validate:"required"`
	Address     string  `json:"address" validate:"required"`
	Description string  `json:"description" validate:"required"`
}

type AssistanceRequest struct {
	UserID      uuid.UUID             `json:"userId"`
	User        UserAssistance        `json:"user" validate:"required"`
	Destination DestinationAssistance `json:"destination" validate:"required"`
}

type AssistanceResponse struct {
	ID          uuid.UUID             `json:"id"`
	User        UserAssistance        `json:"user"`
	Destination DestinationAssistance `json:"destination"`
	Status      BaseName              `json:"status"`
	Price       *float64              `json:"price"`
	CreatedAt   int64                 `json:"createdAt"`
	// DistanceToUser       Distance              `json:"distance_user"`
	// DestinationToDestine Distance              `json:"distance_destination"`
}

type AssistanceCancel struct {
	Id uuid.UUID `json:"id"`
}

type AssistanceUpdate struct {
	StatusID uuid.UUID `json:"statusId"`
}
