package models

import "github.com/google/uuid"

type Color struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
	Hex  string    `db:"hex" json:"hex"`
}
