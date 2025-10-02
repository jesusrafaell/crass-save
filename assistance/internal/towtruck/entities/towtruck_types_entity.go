package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
)

// types
type TowTruckType struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        string    `db:"es,omitempty" json:"es,omitempty"`
	EN        string    `db:"en,omitempty" json:"en,omitempty"`
}

func (TowTruckType) TableName() string {
	return "a_tow_trucks_types"
}

func TowTruckTypeToBase(towTruckType *TowTruckType, lang string) *models.TowTruckType {
	if towTruckType == nil {
		return nil
	}
	item := &models.TowTruckType{
		ID: towTruckType.ID,
	}
	if lang == "en" {
		item.Name = towTruckType.EN
	} else {
		item.Name = towTruckType.ES
	}
	return item
}
