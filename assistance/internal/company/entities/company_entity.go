package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/company/models"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

type Company struct {
	ID          uuid.UUID       `db:"id" json:"id"`
	Name        string          `db:"name" json:"name"`
	Key         uint            `db:"key" json:"key"`
	Description string          `db:"description" json:"description"`
	Email       string          `db:"email" json:"email"`
	Mobile      string          `db:"mobile" json:"mobile"`
	Active      bool            `db:"active" json:"active"`
	Location    *types.Location `db:"location" json:"location,omitempty" gorm:"-" `
	// Lat         float64   `db:"latitude" json:"latitude" gorm:"column:latitude"`
	// Lng         float64   `db:"longitude" json:"longitude" gorm:"column:longitude"`
}

func (Company) TableName() string {
	return "u_companies"
}

func ConvertCompanyToResponse(c *Company) *models.CompanyResponse {
	if c == nil {
		return nil
	}
	return &models.CompanyResponse{
		ID:   c.ID,
		Name: c.Name,
		Key:  c.Key,
	}
}
