package types

import "github.com/google/uuid"

type NameReponse struct {
	Name string `db:"name" json:"name"`
}

type BaseKey struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
	Key  uint      `db:"key" json:"key"`
}
