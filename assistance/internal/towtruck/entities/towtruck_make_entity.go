package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
)

type TowTruckMake struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	Name      string    `db:"name" json:"name"`
}

func (TowTruckMake) TableName() string {
	return "a_tow_trucks_makes"
}

// conver to model
func TowTruckMakeToBase(i *TowTruckMake) *models.TowTruckMake {
	if i == nil {
		return nil
	}
	item := &models.TowTruckMake{
		ID:   i.ID,
		Name: i.Name,
	}
	return item
}
