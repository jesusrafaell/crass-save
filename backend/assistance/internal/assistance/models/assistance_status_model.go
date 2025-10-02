package models

import "github.com/google/uuid"

type UpdateStatus struct {
	ID        uuid.UUID `json:"id" validate:"required"`
	StatusKey string    `json:"status" validate:"required"`
}

type UpdateStatusByDriver struct {
	DriverId  uuid.UUID `json:"driverId" validate:"required"` //headers
	ID        uuid.UUID `json:"id" validate:"required"`
	StatusKey string    `json:"status" validate:"required"`
	Latitude  float64   `json:"latitude" validate:"required"`
	Longitude float64   `json:"longitude" validate:"required"`
	Images    *Images   `json:"images,omitempty"`
}

type CompletedStatus struct {
	UserId       uuid.UUID `json:"userId" validate:"required"`
	ID           uuid.UUID `json:"id" validate:"required"`
	Latitude     float64   `json:"latitude" validate:"required"`
	Longitude    float64   `json:"longitude" validate:"required"`
	Damage       string    `json:"damage" validate:"required"`
	Distance     float64   `json:"distance" validate:"required"`
	Time         int64     `json:"time" validate:"required"`
	Observations string    `json:"observations" validate:"required"`
	PickCar      bool      `json:"pickCar" validate:"required"`
	Stars        *uint32   `json:"stars,omitempty"`  //only user
	Images       *Images   `json:"images,omitempty"` //only driver
}
type Images struct {
	Paths []string `json:"paths" validate:"required"`
}
