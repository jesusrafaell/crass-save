package entities

import (
	"time"

	"bitbucket.org/mya/mya-assistance-core/internal/color/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Color struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	EN        *string   `gorm:"type:varchar(100);uniqueIndex;column:en" json:"en"`
	ES        *string   `gorm:"type:varchar(100);uniqueIndex;column:es" json:"es"`
	Hex       string    `gorm:"type:varchar(7);uniqueIndex;column:hex" json:"hex"`

	Name string `db:"name" json:"name"`
}

func (m *Color) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}

func ColorToBase(color *Color, lang string) *models.Color {
	if color == nil {
		return nil
	}
	item := &models.Color{
		ID:  color.ID,
		Hex: color.Hex,
	}
	if lang == "en" {
		item.Name = *color.EN
	} else {
		item.Name = *color.ES
	}
	return item
}
