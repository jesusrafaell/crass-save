package model

import "github.com/google/uuid"

type Status struct {
	//gorm model
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64  `gorm:"index"`
	ES        string `gorm:"type:varchar(100);uniqueIndex;column:es"`
	EN        string `gorm:"type:varchar(100);uniqueIndex;column:en"`
}

func (Status) TableName() string {
	return "status"
}
