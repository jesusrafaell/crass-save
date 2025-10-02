package tests

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/usecases"

	// countryModel "bitbucket.org/mya/mya-assistance-core/internal/country/models"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestInsurancesUsecase_GetAll(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	insurances := []entities.Insurance{
		{ID: uuid.New(), Name: "Insurance A"},
		{ID: uuid.New(), Name: "Insurance B"},
	}

	mockRepo.On("GetAll").Return(insurances, nil)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetAll(context.Background())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, 2, len(*result))
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_GetAll_Error(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	mockRepo.On("GetAll").Return(nil, errors.New("database error"))

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetAll(context.Background())

	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_GetByCountryID(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	countryID := uuid.New()
	insurances := &[]entities.Insurance{
		{ID: uuid.New(), Name: "Insurance A"},
	}

	mockRepo.On("GetByCountryID", countryID).Return(insurances, nil)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetByCountryID(context.Background(), countryID.String())

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "Insurance A", (*result)[0].Name)
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_Create(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	req := &models.AddInsuranceRequest{Name: "Insurance A"}
	// insurance := entities.Insurance{Name: req.Name}

	mockRepo.On("Create", mock.AnythingOfType("*entities.Insurance")).Return(nil)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	err := uc.Create(context.Background(), req)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_GetByID(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	insuranceID := uuid.New()
	insurance := &entities.Insurance{ID: insuranceID, Name: "Insurance A"}

	mockRepo.On("GetByID", insuranceID).Return(insurance, nil)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetByID(context.Background(), insuranceID)

	assert.NoError(t, err)
	assert.Equal(t, "Insurance A", result.Name)
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_GetByKey(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	key := uint(1)
	insurance := &entities.Insurance{ID: uuid.New(), Name: "Insurance A", Key: key}

	mockRepo.On("GetByKey", key).Return(insurance, nil)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetByKey(context.Background(), key)

	expect := models.Insurance{
		ID:   insurance.ID,
		Name: insurance.Name,
	}

	assert.NoError(t, err)
	assert.Equal(t, expect.ID, result.ID)
	assert.Equal(t, expect.Name, result.Name)
	mockRepo.AssertExpectations(t)
}

func TestInsurancesUsecase_GetWithCountries(t *testing.T) {
	mockRepo := new(mocks.MockInsuranceRepository)
	lang := "en"

	insuranceWithCountries := &[]models.InsuranceWithCountries{
		{
			ID:   uuid.New(),
			Name: "Insurance A",
			// Countries: &,
		},
	}

	mockRepo.On("GetWithCountries", lang).Return(insuranceWithCountries, nil)

	fmt.Println(insuranceWithCountries)

	uc := usecases.NewInsurancesUsecaseImpl(mockRepo)
	result, err := uc.GetWithCountries(context.Background())

	fmt.Println(result)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "Insurance A", (*result)[0].Name)
	mockRepo.AssertExpectations(t)
}
