package model

import (
	"encoding/json"
	"errors"
)

type Location struct {
	Latitude  float64 `json:"latitude" db:"latitude"`
	Longitude float64 `json:"longitude" db:"longitude"`
}

func (s *Location) Scan(value interface{}) error {
	// El tipo esperado es []byte debido a que PostgreSQL devuelve un JSONB como []byte
	byteValue, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	// Deserializar el []byte a la estructura Status usando json.Unmarshal
	return json.Unmarshal(byteValue, &s)
}
