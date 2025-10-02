package models

import (
	"github.com/google/uuid"
)

type EngineType struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
}
