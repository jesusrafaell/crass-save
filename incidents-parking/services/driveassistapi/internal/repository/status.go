package repository

import (
	"api/driveassist/data/model"

	"gorm.io/gorm"
)

type StatusRepository struct {
	db *gorm.DB
}

func NewStatusRepository(database *gorm.DB) *StatusRepository {
	return &StatusRepository{
		db: database,
	}
}

func (repo *StatusRepository) GetByID(id uint) (model.Status, error) {
	var status model.Status
	result := repo.db.First(&status, id)

	if result.Error != nil {
		return model.Status{}, result.Error
	}

	return status, nil
}

func (repo *StatusRepository) GetByNameEN(name string) (*model.Status, error) {
	var status model.Status
	result := repo.db.Where("LOWER(en) = LOWER(?)", name).First(&status)

	if result.Error != nil {
		return nil, result.Error
	}

	return &status, nil
}
