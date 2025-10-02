package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CraneType struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64 `gorm:"index"`
	//
	ES        string     `gorm:"type:varchar(100);uniqueIndex;column:es"`
	EN        string     `gorm:"type:varchar(100);uniqueIndex;column:en"`
	TowTrucks []TowTruck `gorm:"foreignKey:CraneTypeID"`
}

func (CraneType) TableName() string {
	return "dat_cranetype"
}

func (m *CraneType) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
