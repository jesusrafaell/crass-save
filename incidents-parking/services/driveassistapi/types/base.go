package types

import "github.com/google/uuid"

type BaseName struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type BaseColor struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	HEX  string    `json:"hex"`
}
