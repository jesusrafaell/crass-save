package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"

	"github.com/google/uuid"
)

type Insurance struct {
	ID   uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	Name string    `db:"name" json:"name"`
	Key  uint      `db:"key" json:"key"`
	// CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	// UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	// DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	// Countries *[]countries.Country `gorm:"many2many:insurances_countries;" json:"countries,omitempty"`
}

func InsuranceToBase(i *Insurance) *models.Insurance {
	if i == nil {
		return nil
	}
	item := models.Insurance{
		ID:   i.ID,
		Name: i.Name,
	}
	return &item
}
