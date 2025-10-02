package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Country struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64 `gorm:"index"`
	//
	ES         string      `gorm:"type:varchar(100);uniqueIndex;column:es"`
	EN         string      `gorm:"type:varchar(100);uniqueIndex;column:en"`
	Insurances []Insurance `gorm:"many2many:dat_insurance_countries;"`
	Vehicles   []Vehicle   `gorm:"foreignKey:CountryID"`
}

func (Country) TableName() string {
	return "dat_country"
}

func (m *Country) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
