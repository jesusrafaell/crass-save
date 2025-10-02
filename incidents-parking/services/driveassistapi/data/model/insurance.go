package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Insurance struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64     `gorm:"index"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;column:name"`
	Vehicles  []Vehicle `gorm:"foreignKey:InsuranceID"`
	Countries []Country `gorm:"many2many:dat_insurance_country;"`
}

type InsuranceCountry struct {
	ID          uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	InsuranceID uuid.UUID `gorm:"primaryKey"`
	CountryID   uuid.UUID `gorm:"primaryKey"`
}

func (InsuranceCountry) TableName() string {
	return "dat_insurance_country"
}

func (Insurance) TableName() string {
	return "dat_insurance"
}

func (m *Insurance) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
