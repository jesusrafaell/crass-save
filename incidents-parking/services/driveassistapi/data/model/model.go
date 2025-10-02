package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64  `gorm:"index"`
	Name      string `gorm:"type:varchar(100);uniqueIndex;column:name"`
	Vehicles  []Vehicle
	Brands    []Brand `gorm:"many2many:dat_makemodel_vehicle;"`
}

func (Model) TableName() string {
	return "dat_model_vehicle"
}

func (m *Model) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}

type BrandModel struct {
	ID      uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	BrandID uuid.UUID `gorm:"primaryKey;type:uuid;column:brand_id"`
	ModelID uuid.UUID `gorm:"primaryKey;type:uuid;column:model_id"`
}

func (BrandModel) TableName() string {
	return "dat_makemodel_vehicle"
}
