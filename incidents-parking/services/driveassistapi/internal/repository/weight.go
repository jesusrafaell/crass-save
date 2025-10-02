package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WeightRepository struct {
	db *gorm.DB
}

func NewWeightRepository(db *gorm.DB) *WeightRepository {
	return &WeightRepository{db: db}
}

func (repo *WeightRepository) GetByID(id uuid.UUID) (*model.Weight, error) {
	var data model.Weight
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *WeightRepository) GetByTypeID(typeID uuid.UUID) (*[]model.Weight, error) {
	var list []model.Weight
	result := repo.db.Where("type_id = ?", typeID).Order("id").Find(&list)
	if result.Error != nil {
		return nil, result.Error
	}
	return &list, nil
}

func (repo *WeightRepository) Create(data *model.Weight) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *WeightRepository) GetAll() (*[]model.Weight, error) {
	var list []model.Weight
	result := repo.db.Find(&list)
	return &list, result.Error
}

func (repo *WeightRepository) Update(data *model.Weight) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *WeightRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.Weight{}, id)
	return result.Error
}
