package data

import "github.com/google/uuid"

type Company struct {
	ID          uuid.UUID `json:"id"`
	Email       string    `json:"email"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Credits     float64   `json:"credits"`
}

type CompanyUpdate struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Credits     *float64 `json:"credits"`
}
