package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Color struct {
	//gorm.model
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	//
	EN       string    `gorm:"type:varchar(100);uniqueIndex;column:en"`
	ES       string    `gorm:"type:varchar(100);uniqueIndex;column:es"`
	HEX      string    `gorm:"type:varchar(7);uniqueIndex;column:hex"`
	Vehicles []Vehicle `gorm:"foreignKey:ColorID"`
}

func (Color) TableName() string {
	return "dat_color"
}

func (m *Color) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
