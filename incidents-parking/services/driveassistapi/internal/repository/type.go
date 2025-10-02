package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TypeRepository struct {
	db *gorm.DB
}

func NewTypeRepository(db *gorm.DB) *TypeRepository {
	return &TypeRepository{db: db}
}

func (repo *TypeRepository) GetByID(id uuid.UUID) (*model.Type, error) {
	var data model.Type
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TypeRepository) GetByNameEN(name string) (*model.Type, error) {
	var data model.Type
	result := repo.db.Where("en = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TypeRepository) Create(data *model.Type) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *TypeRepository) GetAll() (*[]model.Type, error) {
	var list []model.Type
	result := repo.db.Order("en ASC").Find(&list)
	return &list, result.Error
}

func (repo *TypeRepository) Update(data *model.Type) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *TypeRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.Type{}, id)
	return result.Error
}
