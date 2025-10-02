package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CountryRepository struct {
	db *gorm.DB
}

func NewCountryRepository(db *gorm.DB) *CountryRepository {
	return &CountryRepository{db: db}
}

func (repo *CountryRepository) GetByID(id uuid.UUID) (*model.Country, error) {
	var data model.Country
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *CountryRepository) GetByName(name string) (*model.Country, error) {
	var data model.Country
	result := repo.db.Where("en = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *CountryRepository) Create(data *model.Country) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *CountryRepository) GetAll() (*[]model.Country, error) {
	var list []model.Country
	result := repo.db.Order("en ASC").Find(&list)
	return &list, result.Error
}

func (repo *CountryRepository) Update(data *model.Country) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *CountryRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.Country{}, id)
	return result.Error
}
