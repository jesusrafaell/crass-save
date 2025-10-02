package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Brand struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64  `gorm:"index"`
	Name      string `gorm:"type:varchar(100);uniqueIndex;column:name"`
	Vehicles  []Vehicle
	Models    []Model `gorm:"many2many:dat_makemodel_vehicle;"`
}

func (Brand) TableName() string {
	return "dat_make_vehicle"
}

func (m *Brand) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
