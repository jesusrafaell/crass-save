package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/models"

	"github.com/google/uuid"
)

type EngineType struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        *string   `db:"es" json:"es,omitempty"`
	EN        *string   `db:"en" json:"en,omitempty"`

	Name string `db:"name" json:"name"`
}

func EngineTypeToBase(eType *EngineType, lang string) *models.EngineType {
	if eType == nil {
		return nil
	}
	item := models.EngineType{
		ID: eType.ID,
	}
	if lang == "en" {
		item.Name = *eType.EN
	} else {
		item.Name = *eType.ES
	}
	return &item
}
