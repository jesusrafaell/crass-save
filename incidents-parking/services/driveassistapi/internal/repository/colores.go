package repository

import (
	"api/driveassist/data/model"

	"gorm.io/gorm"
)

type ColorRepository struct {
	db *gorm.DB
}

func NewColorRepository(db *gorm.DB) *ColorRepository {
	return &ColorRepository{db}
}

func (repo *ColorRepository) Create(data *model.Color) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *ColorRepository) GetAll() (*[]model.Color, error) {
	var list []model.Color
	result := repo.db.Order("en ASC").Find(&list)
	return &list, result.Error
}
