package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/weight/models"

	"github.com/google/uuid"
)

type Weight struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        string    `db:"es,omitempty" json:"es,omitempty"`
	EN        string    `db:"en,omitempty" json:"en,omitempty"`
	Key       uint      `gorm:"column:key" db:"key" json:"key"`
}

func WeightToBase(w *Weight, lang string) *models.Weight {
	if w == nil {
		return nil
	}
	item := models.Weight{
		ID: w.ID,
	}
	if lang == "en" {
		item.Name = w.EN
	} else {
		item.Name = w.ES
	}
	return &item
}
