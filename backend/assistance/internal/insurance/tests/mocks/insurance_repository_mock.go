package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockInsuranceRepository struct {
	mock.Mock
}

func (m *MockInsuranceRepository) GetByID(id uuid.UUID) (*entities.Insurance, error) {
	args := m.Called(id)
	if insurance, ok := args.Get(0).(*entities.Insurance); ok {
		return insurance, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInsuranceRepository) GetByName(name string) (*entities.Insurance, error) {
	args := m.Called(name)
	if insurance, ok := args.Get(0).(*entities.Insurance); ok {
		return insurance, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInsuranceRepository) GetByKey(key uint) (*entities.Insurance, error) {
	args := m.Called(key)
	if insurance, ok := args.Get(0).(*entities.Insurance); ok {
		return insurance, args.Error(1)
	}
	return nil, args.Error(1)
}

// Mock for Create
func (m *MockInsuranceRepository) Create(insurance *entities.Insurance) error {
	args := m.Called(insurance)
	return args.Error(0)
}

func (m *MockInsuranceRepository) GetAll() ([]entities.Insurance, error) {
	args := m.Called()
	if insurances, ok := args.Get(0).([]entities.Insurance); ok {
		return insurances, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInsuranceRepository) GetCountriesByID(id uuid.UUID) (*entities.Insurance, error) {
	args := m.Called(id)
	if insurance, ok := args.Get(0).(*entities.Insurance); ok {
		return insurance, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInsuranceRepository) GetByCountryID(countryID uuid.UUID) (*[]entities.Insurance, error) {
	args := m.Called(countryID)
	if insurances, ok := args.Get(0).(*[]entities.Insurance); ok {
		return insurances, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInsuranceRepository) Update(insurance *entities.Insurance) error {
	args := m.Called(insurance)
	return args.Error(0)
}

func (m *MockInsuranceRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockInsuranceRepository) GetWithCountries(lang string) (*[]models.InsuranceWithCountries, error) {
	args := m.Called(lang)
	if insuranceWithCountries, ok := args.Get(0).(*[]models.InsuranceWithCountries); ok {
		return insuranceWithCountries, args.Error(1)
	}
	return nil, args.Error(1)
}
