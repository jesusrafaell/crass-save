package models

import (
	countryModel "bitbucket.org/mya/mya-assistance-core/internal/country/models"

	"github.com/google/uuid"
)

type Insurance struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `db:"name" json:"name"`
	Key  uint      `db:"key" json:"key"`
}

type InsuranceWithCountries struct {
	ID        uuid.UUID               `json:"id" db:"id"`
	Name      string                  `db:"name" json:"name"`
	Key       uint                    `db:"key" json:"key"`
	Countries *[]countryModel.Country `db:"countries" json:"countries,omitempty"`
	CreatedAt int64                   `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64                   `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
}

type AddInsuranceRequest struct {
	Name      string      `json:"name"`
	Countries []uuid.UUID `json:"contries"`
}

type InsuranceResponse struct {
	ID        uuid.UUID               `json:"id"`
	Name      string                  `json:"name"`
	Countries *[]countryModel.Country `json:"countries,omitempty"`
}
