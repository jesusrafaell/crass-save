package models

import "github.com/google/uuid"

type VehicleType struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `db:"name" json:"name"`
	Key  uint      `db:"key" json:"key"`
}
