package types

import "github.com/google/uuid"

type ModelRquest struct {
	Model    string    `json:"name"`
	BrandID  uuid.UUID `json:"brandId,omitempty"`
	NewBrand string    `json:"newBrand,omitempty"`
}
