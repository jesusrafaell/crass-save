package repository

import (
	"api/driveassist/data/model"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type InsuranceRepository struct {
	db *gorm.DB
}

func NewInsuranceRepository(db *gorm.DB) *InsuranceRepository {
	return &InsuranceRepository{db: db}
}

func (repo *InsuranceRepository) GetByID(id uuid.UUID) (*model.Insurance, error) {
	var data model.Insurance
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *InsuranceRepository) GetByName(name string) (*model.Insurance, error) {
	var data model.Insurance
	result := repo.db.Where("name = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *InsuranceRepository) Create(data *model.Insurance) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *InsuranceRepository) GetAll() (*[]model.Insurance, error) {
	var list []model.Insurance
	result := repo.db.Order("name ASC").Find(&list)
	return &list, result.Error
}

func (repo *InsuranceRepository) GetWithCountries() (*[]model.Insurance, error) {
	var insurances []model.Insurance
	result := repo.db.Preload("Countries").Find(&insurances)
	if result.Error != nil {
		return nil, result.Error
	}

	return &insurances, nil
}

func (repo *InsuranceRepository) GetByCountryID(countryID uuid.UUID) ([]model.Insurance, error) {
	var insurances []model.Insurance
	result := repo.db.
		Preload("Countries").
		Joins("JOIN insurance_countries on insurance_countries.insurance_id = insurances.id").
		Joins("JOIN countries on countries.id = insurance_countries.country_id").
		Where("countries.id = ?", countryID).
		Find(&insurances)

	return insurances, result.Error
}

func (repo *InsuranceRepository) GetByCountryByLang(lang string, country string) ([]model.Insurance, error) {
	var insurances []model.Insurance
	lowerCountry := strings.ToLower(country)
	langField := "en"
	if lang == "es" {
		langField = "es"
	}
	result := repo.db.
		Joins("JOIN insurance_countries on insurance_countries.insurance_id = insurances.id").
		Joins("JOIN countries on countries.id = insurance_countries.country_id").
		Where("LOWER(countries."+langField+") = ?", lowerCountry).
		Find(&insurances)

	return insurances, result.Error
}

func (repo *InsuranceRepository) Update(data *model.Insurance) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *InsuranceRepository) Delete(id uuid.UUID) error {
	now := time.Now().Unix()
	result := repo.db.Delete(&model.Insurance{
		DeletedAt: now,
	}, id)
	return result.Error
}

func (repo *InsuranceRepository) GetCountriesByID(id uuid.UUID) (*model.Insurance, error) {
	var insurance model.Insurance
	result := repo.db.Preload("Countries").First(&insurance, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &insurance, nil
}
