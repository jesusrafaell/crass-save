package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CraneTypeRepository struct {
	db *gorm.DB
}

func NewCraneTypeRepository(db *gorm.DB) *CraneTypeRepository {
	return &CraneTypeRepository{db}
}

func (repo *CraneTypeRepository) GetByID(id uuid.UUID) (*model.CraneType, error) {
	var data model.CraneType
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *CraneTypeRepository) GetByNameEN(name string) (*model.CraneType, error) {
	var data model.CraneType
	result := repo.db.Where("en = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *CraneTypeRepository) Create(data *model.CraneType) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *CraneTypeRepository) GetAll() (*[]model.CraneType, error) {
	var list []model.CraneType
	result := repo.db.Order("en ASC").Find(&list)
	return &list, result.Error
}

func (repo *CraneTypeRepository) Update(data *model.CraneType) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *CraneTypeRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.CraneType{}, id)
	return result.Error
}
