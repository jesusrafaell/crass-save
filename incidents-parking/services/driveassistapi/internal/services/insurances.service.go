package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"
	"api/driveassist/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type InsurancesService struct {
	insuranceRepo repo.InsuranceRepository
}

func NewInsurancesService(db *gorm.DB) *InsurancesService {
	return &InsurancesService{
		insuranceRepo: *repo.NewInsuranceRepository(db),
	}
}

func (s *InsurancesService) GetAll() (*[]model.Insurance, error) {
	insurances, err := s.insuranceRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return insurances, nil
}

func (s *InsurancesService) GetWithCountries() (*[]model.Insurance, error) {
	insurances, err := s.insuranceRepo.GetWithCountries()
	if err != nil {
		return nil, err
	}
	return insurances, nil
}

func (s *InsurancesService) GetByCountryID(countryID string) (*[]model.Insurance, error) {
	countryUUID, err := uuid.Parse(countryID)
	if err != nil {
		return nil, err
	}

	insurances, err := s.insuranceRepo.GetByCountryID(countryUUID)
	if err != nil {
		return nil, err
	}
	return &insurances, nil
}

func (s *InsurancesService) GetByCountry(lang string, country string) (*[]model.Insurance, error) {
	insurances, err := s.insuranceRepo.GetByCountryByLang(lang, country)
	if err != nil {
		return nil, err
	}
	return &insurances, nil
}

func (s *InsurancesService) Create(req types.InsuranceRequest) (*model.Insurance, error) {
	incurance := model.Insurance{
		Name: req.Name,
	}
	err := s.insuranceRepo.Create(&incurance)
	if err != nil {
		return nil, err
	}
	//add countries
	return &incurance, nil
}

func (s *InsurancesService) GetById(id uuid.UUID) (*model.Insurance, error) {
	insurances, err := s.insuranceRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return insurances, nil
}
