package tests

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestTowTruckMakesUsecase_GetAll(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckMakesRepository)
	mockUsecase := usecases.NewTowTruckMakesUsecaseImpl(mockRepo)

	mockMakes := []models.TowTruckMake{{ID: uuid.New(), Name: "Make1"}, {ID: uuid.New(), Name: "Make2"}}
	mockRepo.On("GetAll").Return(&mockMakes, nil)

	makes, err := mockUsecase.GetAll()
	assert.NoError(t, err)
	assert.Equal(t, &mockMakes, makes)
}

func TestTowTruckMakesUsecase_Create(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckMakesRepository)
	mockUsecase := usecases.NewTowTruckMakesUsecaseImpl(mockRepo)

	t.Run("Success", func(t *testing.T) {
		mockData := models.TowTruckMake{Name: "NewMake"}
		mockRepo.On("GetByName", mockData.Name).Return(nil, nil)
		mockRepo.On("Create", mock.AnythingOfType("*entities.TowTruckMake")).Return(nil)

		err := mockUsecase.Create(&mockData)
		assert.Nil(t, err)
		mockRepo.AssertExpectations(t)
	})

	t.Run("Duplicate Error", func(t *testing.T) {
		mockData := models.TowTruckMake{Name: "ExistingMake"}
		mockRepo.On("GetByName", mockData.Name).Return(&mockData, nil)

		err := mockUsecase.Create(&mockData)
		assert.Equal(t, &apierrors.Duplicate, err)
		mockRepo.AssertExpectations(t)
	})
}

func TestTowTruckMakesUsecase_Update(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckMakesRepository)
	usecase := usecases.NewTowTruckMakesUsecaseImpl(mockRepo)

	t.Run("Success", func(t *testing.T) {
		mockData := models.TowTruckMake{ID: uuid.New(), Name: "UpdatedMake"}
		mockRepo.On("Update", mock.AnythingOfType("*entities.TowTruckMake")).Return(nil)

		err := usecase.Update(mockData.ID, &mockData)
		assert.Nil(t, err)
		mockRepo.AssertExpectations(t)
	})
}

func TestUpdate_Error(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckMakesRepository)
	id := uuid.New()
	mockData := models.TowTruckMake{Name: "NonExistingMake"}

	mockRepo.On("Update", mock.Anything).Return(apierrors.MakeNotFound)

	usecase := usecases.NewTowTruckMakesUsecaseImpl(mockRepo)
	err := usecase.Update(id, &mockData)

	assert.Equal(t, apierrors.MakeNotFound.Code, err.Code)
	mockRepo.AssertExpectations(t)
}
