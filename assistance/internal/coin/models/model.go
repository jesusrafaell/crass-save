package models

import (
	"github.com/google/uuid"
)

type Coin struct {
	ID     uuid.UUID `json:"id"`
	Key    uint      `json:"key"`
	Name   string    `json:"name"`
	Symbol string    `json:"symbol"`
}
