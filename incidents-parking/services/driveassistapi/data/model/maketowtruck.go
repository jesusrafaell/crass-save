package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MakeTowTruck struct {
	//gorm
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64  `gorm:"index"`
	Name      string `gorm:"type:varchar(100);uniqueIndex;column:name"`
}

func (MakeTowTruck) TableName() string {
	return "dat_make_towtruck"
}

func (m *MakeTowTruck) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
