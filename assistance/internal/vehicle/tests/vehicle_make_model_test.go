package test

import (
	"context"
	"errors"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetMakes(t *testing.T) {
	mockMakeRepo := new(mocks.MakeRepository)
	expectedMakes := &[]models.VehicleMake{
		{ID: uuid.New(), Name: "Toyota"},
		{ID: uuid.New(), Name: "Ford"},
	}
	mockMakeRepo.On("GetAll").Return(expectedMakes, nil)

	usecase := usecases.NewMakeModelUsecaseImpl(mockMakeRepo, nil)

	makes, err := usecase.GetMakes(context.Background())
	assert.NoError(t, err)
	assert.Equal(t, expectedMakes, makes)
	mockMakeRepo.AssertExpectations(t)
}

func TestGetMakeByModelID_Success(t *testing.T) {
	mockMakeRepo := new(mocks.MakeRepository)
	modelID := uuid.New()
	expectedMake := &models.VehicleMake{ID: uuid.New(), Name: "Toyota"}
	mockMakeRepo.On("GetByModelID", modelID).Return(expectedMake, nil)

	usecase := usecases.NewMakeModelUsecaseImpl(mockMakeRepo, nil)

	make, err := usecase.GetMakeByModelID(context.Background(), modelID)

	assert.NoError(t, err.ErrorGo())
	assert.Equal(t, expectedMake, make)
	mockMakeRepo.AssertExpectations(t)
}

func TestGetMakeByModelID_NotFound(t *testing.T) {
	mockMakeRepo := new(mocks.MakeRepository)
	modelID := uuid.New()
	mockMakeRepo.On("GetByModelID", modelID).Return(nil, errors.New("not found"))

	usecase := usecases.NewMakeModelUsecaseImpl(mockMakeRepo, nil)

	make, err := usecase.GetMakeByModelID(context.Background(), modelID)
	assert.Nil(t, make)
	assert.Equal(t, &apierrors.MakeNotFound, err)
	mockMakeRepo.AssertExpectations(t)
}

func TestCreateMake_Success(t *testing.T) {
	mockMakeRepo := new(mocks.MakeRepository)
	newMake := &entities.VehicleMake{Name: "Honda"}
	mockMakeRepo.On("Create", newMake).Return(nil)

	usecase := usecases.NewMakeModelUsecaseImpl(mockMakeRepo, nil)

	err := usecase.CreateMake(context.Background(), newMake)
	assert.NoError(t, err)
	mockMakeRepo.AssertExpectations(t)
}

func TestGetByMakeID_Success(t *testing.T) {
	mockModelRepo := new(mocks.ModelRepository)
	makeID := uuid.New()
	expectedModels := &[]models.VehicleModel{
		{ID: uuid.New(), Name: "Corolla"},
		{ID: uuid.New(), Name: "Camry"},
	}
	mockModelRepo.On("GetByMakeID", makeID).Return(expectedModels, nil)

	usecase := usecases.NewMakeModelUsecaseImpl(nil, mockModelRepo)

	models, err := usecase.GetModelsByMakeID(context.Background(), makeID.String())
	assert.NoError(t, err)
	assert.Equal(t, expectedModels, models)
	mockModelRepo.AssertExpectations(t)
}

func TestCreateModel_WithNewMake(t *testing.T) {
	mockMakeRepo := new(mocks.MakeRepository)
	mockModelRepo := new(mocks.ModelRepository)

	makeID := uuid.New()

	req := &models.CreateVehicleModel{
		MakeID:  makeID,
		NewMake: "Honda", //make
		Model:   "Civic", //new model
	}

	expectedModel := &models.VehicleModel{Name: req.Model}

	mockMakeRepo.On("Create", mock.AnythingOfType("*entities.VehicleMake")).Return(nil).Run(func(args mock.Arguments) {
		makeArg := args.Get(0).(*entities.VehicleMake)
		makeArg.ID = makeID // simulate ID assignment after creation
	})

	mockModelRepo.On("Create", mock.AnythingOfType("*models.VehicleModel"), makeID).Return(nil)

	usecase := usecases.NewMakeModelUsecaseImpl(mockMakeRepo, mockModelRepo)

	model, err := usecase.CreateModel(context.Background(), req)

	assert.NoError(t, err)
	assert.Equal(t, expectedModel.Name, model.Name)
	mockMakeRepo.AssertExpectations(t)
	mockModelRepo.AssertExpectations(t)
}

func TestCreateModel_ExistingMake(t *testing.T) {
	mockModelRepo := new(mocks.ModelRepository)

	req := &models.CreateVehicleModel{
		Model:  "Camry",
		MakeID: uuid.New(),
	}

	expectedModel := &models.VehicleModel{Name: req.Model}
	mockModelRepo.On("Create", mock.AnythingOfType("*models.VehicleModel"), req.MakeID).Return(nil)

	usecase := usecases.NewMakeModelUsecaseImpl(nil, mockModelRepo)

	model, err := usecase.CreateModel(context.Background(), req)
	assert.NoError(t, err)
	assert.Equal(t, expectedModel.Name, model.Name)
	mockModelRepo.AssertExpectations(t)
}
