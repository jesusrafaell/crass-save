package models

import (
	"github.com/google/uuid"
)

type VehicleModel struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `json:"name" db:"name"`
}

type CreateVehicleModel struct {
	MakeID  uuid.UUID `json:"makeId,omitempty"`
	NewMake string    `json:"newMake,omitempty"`
	Model   string    `json:"name"`
}
