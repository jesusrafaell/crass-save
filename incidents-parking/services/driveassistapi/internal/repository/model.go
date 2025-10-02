package repository

import (
	"api/driveassist/data/model"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ModelRepository struct {
	db *gorm.DB
}

func NewModelRepository(db *gorm.DB) *ModelRepository {
	return &ModelRepository{db: db}
}

func (repo *ModelRepository) Create(data *model.Model, brandID uuid.UUID) error {
	err := repo.db.Where("name = ?", data.Name).First(&data).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// model not exist, create
		result := repo.db.Create(&data)
		if result.Error != nil {
			return result.Error
		}
	} else if err != nil {
		return err
	}

	var brandModel model.BrandModel
	err = repo.db.Where("brand_id = ? AND model_id = ?", brandID, data.ID).First(&brandModel).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		brandModel = model.BrandModel{
			BrandID: brandID,
			ModelID: data.ID,
		}
		return repo.db.Create(&brandModel).Error
	} else if brandModel.ID != uuid.Nil {
		return fmt.Errorf("%s", "Model & brand exist")
	}
	return err
}

func (repo *ModelRepository) GetAll() (*[]model.Model, error) {
	var models []model.Model
	result := repo.db.Order("name ASC").Find(&models)
	return &models, result.Error
}

func (repo *ModelRepository) GetByBrandID(brandId uuid.UUID) (*[]model.Model, error) {
	var models []model.Model
	err := repo.db.
		Joins("JOIN dat_makemodel_vehicle ON dat_makemodel_vehicle.model_id = dat_model_vehicle.id").
		Where("dat_makemodel_vehicle.brand_id = ?", brandId).
		Order("dat_model_vehicle.name ASC").
		Find(&models).Error

	if err != nil {
		return nil, err
	}

	return &models, nil
}

func (repo *ModelRepository) Update(data *model.Model) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *ModelRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.Model{}, id)
	return result.Error
}
