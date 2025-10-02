package tests

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestTowTruckTypesUsecase_Create(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckTypesRepository)
	mockUsecase := usecases.NewTowTruckTypesUsecaseImpl(mockRepo)

	t.Run("Success", func(t *testing.T) {
		mockData := entities.TowTruckType{EN: "NewTypeEN", ES: "NewTypeES"}
		mockRepo.On("GetByNames", mockData.EN, mockData.ES).Return(nil, nil)
		mockRepo.On("Create", &mockData).Return(nil)

		err := mockUsecase.Create(&mockData)
		assert.Nil(t, err)
		mockRepo.AssertExpectations(t)
	})

	t.Run("Duplicate Error", func(t *testing.T) {
		mockData := entities.TowTruckType{EN: "ExistingTypeEN", ES: "ExistingTypeES"}
		mockRepo.On("GetByNames", mockData.EN, mockData.ES).Return(&models.TowTruckType{}, nil)

		err := mockUsecase.Create(&mockData)
		assert.Equal(t, &apierrors.Duplicate, err)
		mockRepo.AssertExpectations(t)
	})

	// t.Run("Server Error on Create", func(t *testing.T) {
	// 	mockData := entities.TowTruckType{EN: "NewTypeEN", ES: "NewTypeES"}
	// 	mockRepo.On("GetByNames", mockData.EN, mockData.ES).Return(nil, nil)
	// 	mockRepo.On("Create", &mockData).Return(apierrors.ErrorServer)

	// 	err := mockUsecase.Create(&mockData)
	// 	assert.Equal(t, &apierrors.ErrorServer, err)
	// 	mockRepo.AssertExpectations(t)
	// })
}

func TestTowTruckTypesUsecase_GetAll(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckTypesRepository)
	mockUsecase := usecases.NewTowTruckTypesUsecaseImpl(mockRepo)

	lang := "en"
	mockTypes := []models.TowTruckType{{ID: uuid.New(), Name: "Type1"}, {ID: uuid.New(), Name: "Type2"}}
	mockRepo.On("GetAll", lang).Return(&mockTypes, nil)

	types, err := mockUsecase.GetAll(lang)
	assert.NoError(t, err)
	assert.Equal(t, &mockTypes, types)
	mockRepo.AssertExpectations(t)
}

func TestTowTruckTypesUsecase_Update(t *testing.T) {
	mockRepo := new(mocks.MockTowTruckTypesRepository)
	mockUsecase := usecases.NewTowTruckTypesUsecaseImpl(mockRepo)

	t.Run("Success", func(t *testing.T) {
		mockData := entities.TowTruckType{ID: uuid.New(), EN: "UpdatedEN", ES: "UpdatedES"}
		mockRepo.On("Update", &mockData).Return(nil)

		err := mockUsecase.Update(&mockData)
		assert.Nil(t, err)
		mockRepo.AssertExpectations(t)
	})

	// t.Run("Not Found Error", func(t *testing.T) {
	// 	mockData := entities.TowTruckType{ID: uuid.New(), EN: "NonExistingEN", ES: "NonExistingES"}
	// 	mockRepo.On("Update", &mockData).Return(apierrors.CraneTypeNotFound)

	// 	err := mockUsecase.Update(&mockData)
	// 	assert.Equal(t, &apierrors.CraneTypeNotFound, err)
	// 	mockRepo.AssertExpectations(t)
	// })
}
