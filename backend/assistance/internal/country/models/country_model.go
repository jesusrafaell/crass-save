package models

import "github.com/google/uuid"

type Country struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `db:"name" json:"name"`
}
