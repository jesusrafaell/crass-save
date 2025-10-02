package tests

import (
	"context"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/company/models"
	"bitbucket.org/mya/mya-assistance-core/internal/company/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/company/usecases"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

var company = &models.Company{
	Name:        "New Company",
	Description: "New company description",
	Email:       "email@example.com",
	Mobile:      "1234567890",
	Location:    &types.Location{Lat: 10.0, Lng: 20.0},
}

func TestCreateCompany_Success(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

	company := &models.CreateCompany{
		Name:        company.Name,
		Description: company.Description,
		Email:       company.Email,
		Mobile:      company.Mobile,
		Location:    *company.Location,
	}

	mockRepo.On("GetByName", company.Name).Return(nil, nil)
	mockRepo.On("Create", mock.AnythingOfType("*models.Company")).Return(nil)

	err := usecase.Create(context.Background(), company)
	assert.Nil(t, err)
	mockRepo.AssertExpectations(t)
}

func TestCreateCompany_Duplicate(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

	// Define a company object with the same name to simulate duplication
	company := &models.CreateCompany{
		Name:        company.Name,
		Description: company.Description,
		Email:       company.Email,
		Mobile:      company.Mobile,
		Location:    *company.Location,
	}

	existingCompany := &models.Company{Name: company.Name}
	mockRepo.On("GetByName", company.Name).Return(existingCompany, nil)

	expected := &apierrors.Duplicate

	err := usecase.Create(context.Background(), company)

	assert.Equal(t, expected.Code, err.Code)
	mockRepo.AssertExpectations(t)
}

func TestGetAllCompanies(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

	t.Run("GetAll successful", func(t *testing.T) {
		companies := []models.Company{
			{Name: "Company1"},
			{Name: "Company2"},
		}
		mockRepo.On("GetAll").Return(&companies, nil)

		result, err := usecase.GetAll(context.Background())
		assert.Nil(t, err)
		assert.Equal(t, &companies, result)
		mockRepo.AssertExpectations(t)
	})
}

func TestGetCompanyByID(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

	t.Run("GetByID successful", func(t *testing.T) {
		companyID := uuid.New()
		company := &models.Company{ID: companyID, Name: "Company"}
		mockRepo.On("GetByID", companyID).Return(company, nil)

		result, err := usecase.GetByID(context.Background(), companyID)
		assert.Nil(t, err)
		assert.Equal(t, company, result)
		mockRepo.AssertExpectations(t)
	})

	t.Run("GetByID not found", func(t *testing.T) {
		companyID := uuid.New()
		mockRepo.On("GetByID", companyID).Return(nil, apierrors.CompanyNotFound)

		result, err := usecase.GetByID(context.Background(), companyID)
		assert.Nil(t, result)
		assert.Equal(t, &apierrors.CompanyNotFound, err)
		mockRepo.AssertExpectations(t)
	})
}

func TestUpdateCompany(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)
	companyID := uuid.New()

	t.Run("Update successful", func(t *testing.T) {
		company := &models.Company{ID: companyID, Name: "Updated Company"}
		mockRepo.On("Update", company).Return(nil)

		err := usecase.Update(context.Background(), companyID, company)
		assert.Nil(t, err)
		mockRepo.AssertExpectations(t)
	})

	t.Run("Update error", func(t *testing.T) {
		company := &models.Company{ID: companyID, Name: "Company Not Found"}
		mockRepo.On("Update", company).Return(apierrors.CompanyNotFound)

		err := usecase.Update(context.Background(), companyID, company)
		assert.Equal(t, &apierrors.CompanyNotFound, err)
		mockRepo.AssertExpectations(t)
	})
}

func TestGetCompanyByKey(t *testing.T) {
	mockRepo := new(mocks.CompanyRepository)
	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

	t.Run("GetByKey successful", func(t *testing.T) {
		key := uint(1)
		company := &models.Company{Key: key, Name: "Company"}
		mockRepo.On("GetByKey", key).Return(company, nil)

		result, err := usecase.GetByKey(context.Background(), key)
		assert.Nil(t, err)
		assert.Equal(t, company, result)
		mockRepo.AssertExpectations(t)
	})

	t.Run("GetByKey not found", func(t *testing.T) {
		key := uint(2)
		mockRepo.On("GetByKey", key).Return(nil, apierrors.CompanyNotFound)

		result, err := usecase.GetByKey(context.Background(), key)
		assert.Nil(t, result)
		assert.Equal(t, &apierrors.CompanyNotFound, err)
		mockRepo.AssertExpectations(t)
	})
}

// func TestGetAllCompanyInfo(t *testing.T) {
// 	mockRepo := new(mocks.CompanyRepository)
// 	usecase := usecases.NewCompanyUsecaseImpl(mockRepo)

// 	t.Run("GetAllInfo successful", func(t *testing.T) {
// 		companyInfo := []models.CompanyInfo{{Name: "Company1"}, {Name: "Company2"}}
// 		mockRepo.On("GetAllCompaniesInfo").Return(&companyInfo, nil)

// 		result, err := usecase.GetAllInfo()
// 		assert.Nil(t, err)
// 		assert.Equal(t, &companyInfo, result)
// 		mockRepo.AssertExpectations(t)
// 	})

// 	t.Run("GetAllInfo error", func(t *testing.T) {
// 		mockRepo.On("GetAllCompaniesInfo").Return(nil, apierrors.ErrorServer)

// 		result, err := usecase.GetAllInfo()
// 		assert.Nil(t, result)
// 		assert.Equal(t, apierrors.ErrorServer, err)
// 		mockRepo.AssertExpectations(t)
// 	})
// }
