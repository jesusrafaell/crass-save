package models

import "github.com/google/uuid"

type VehicleMake struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `json:"name" db:"name"`
}

type VehicleMakeAndModel struct {
	Make  VehicleMake  `db:"make" json:"make"`
	Model VehicleModel `db:"model" json:"model"`
}
