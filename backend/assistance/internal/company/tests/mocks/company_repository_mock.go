package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/company/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type CompanyRepository struct {
	mock.Mock
}

func (m *CompanyRepository) GetByID(id uuid.UUID) (*models.Company, error) {
	args := m.Called(id)
	if company, ok := args.Get(0).(*models.Company); ok {
		return company, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *CompanyRepository) GetByKey(key uint) (*models.Company, error) {
	args := m.Called(key)
	if company, ok := args.Get(0).(*models.Company); ok {
		return company, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *CompanyRepository) GetByName(name string) (*models.Company, error) {
	args := m.Called(name)
	if company, ok := args.Get(0).(*models.Company); ok {
		return company, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *CompanyRepository) Create(data *models.Company) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *CompanyRepository) GetAll() (*[]models.Company, error) {
	args := m.Called()
	if companies, ok := args.Get(0).(*[]models.Company); ok {
		return companies, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *CompanyRepository) Update(data *models.Company) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *CompanyRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *CompanyRepository) GetAllCompaniesInfo() (*[]models.CompanyInfo, error) {
	args := m.Called()
	if companyInfo, ok := args.Get(0).(*[]models.CompanyInfo); ok {
		return companyInfo, args.Error(1)
	}
	return nil, args.Error(1)
}
