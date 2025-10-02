package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Weight struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64      `gorm:"index"`
	ES        string     `gorm:"type:varchar(100);uniqueIndex;column:es"`
	EN        string     `gorm:"type:varchar(100);uniqueIndex;column:en"`
	Vehicles  []Vehicle  `gorm:"foreignKey:WeightID"`
	TowTrucks []TowTruck `gorm:"foreignKey:WeightID"`
}

func (Weight) TableName() string {
	return "dat_weight"
}

func (m *Weight) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
