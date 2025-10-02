package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BrandRepository struct {
	db *gorm.DB
}

func NewBrandRepository(db *gorm.DB) *BrandRepository {
	return &BrandRepository{db: db}
}

func (repo *BrandRepository) GetByID(id uuid.UUID) (*model.Brand, error) {
	var data model.Brand
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *BrandRepository) GetByName(name string) (*model.Brand, error) {
	var data model.Brand
	result := repo.db.Where("name = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *BrandRepository) Create(data *model.Brand) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *BrandRepository) GetAll() (*[]model.Brand, error) {
	var list []model.Brand
	result := repo.db.Order("name ASC").Find(&list)
	return &list, result.Error
}

func (repo *BrandRepository) Update(data *model.Brand) error {
	result := repo.db.Save(&data)
	return result.Error
}

func (repo *BrandRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.Brand{}, id)
	return result.Error
}

func (repo *BrandRepository) GetModelsByBrandID(brandID uuid.UUID) (*[]model.Model, error) {
	var models []model.Model

	err := repo.db.Model(&model.Model{}).
		Joins("JOIN dat_makemodel_vehicle ON dat_makemodel_vehicle.model_id = dat_model_vehicle.id").
		Where("dat_makemodel_vehicle.brand_id = ?", brandID).
		Find(&models).Error

	if err != nil {
		return nil, err
	}

	return &models, nil
}
