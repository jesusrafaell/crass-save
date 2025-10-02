package data

import "github.com/google/uuid"

type Service struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Key  int32     `json:"key" db:"key"`
	Name string    `json:"name" db:"name"`
}
