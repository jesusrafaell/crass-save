package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type CountryService struct {
	countryRepo repo.CountryRepository
}

func NewCountryService(db *gorm.DB) *CountryService {
	return &CountryService{
		countryRepo: *repo.NewCountryRepository(db),
	}
}

func (s *CountryService) GetAll() (*[]model.Country, error) {
	contries, err := s.countryRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return contries, nil
}
