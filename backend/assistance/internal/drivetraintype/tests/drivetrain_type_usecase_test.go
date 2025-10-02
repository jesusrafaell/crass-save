package tests

import (
	"context"
	"errors"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/usecases"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetAll_Success(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	// Mock data and behavior
	lang := "en"
	expectedList := &[]models.DriveTrainType{
		{ID: uuid.New(), Name: "4WD"},
		{ID: uuid.New(), Name: "AWD"},
	}
	mockRepo.On("GetAll", lang).Return(expectedList, nil)

	// Execute test
	result, err := usecase.GetAll(context.Background())
	assert.NoError(t, err)
	assert.Equal(t, expectedList, result)
	mockRepo.AssertExpectations(t)
}

func TestGetAll_Error(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	lang := "en"
	mockRepo.On("GetAll", lang).Return(nil, errors.New("database error"))

	// Execute test
	result, err := usecase.GetAll(context.Background())
	assert.Error(t, err)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestGetByID_Success(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	lang := "en"
	id := uuid.New()
	expected := &models.DriveTrainType{ID: id, Name: "4WD"}
	mockRepo.On("GetByID", lang, id).Return(expected, nil)

	// Execute test
	result, customErr := usecase.GetByID(context.Background(), id)
	assert.Nil(t, customErr)
	assert.Equal(t, expected, result)
	mockRepo.AssertExpectations(t)
}

func TestGetByID_NotFound(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	lang := "en"
	id := uuid.New()
	mockRepo.On("GetByID", lang, id).Return(nil, errors.New("not found"))

	// Execute test
	result, customErr := usecase.GetByID(context.Background(), id)
	assert.Equal(t, &apierrors.DriverNotFound, customErr)
	assert.Nil(t, result)
	mockRepo.AssertExpectations(t)
}

func TestCreate_Success(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	newDriveTrain := &models.CreateDriveTrainType{EN: "4WD", ES: "4x4"}
	mockRepo.On("Create", mock.AnythingOfType("*entities.DriveTrainType")).Return(nil)

	// Execute test
	err := usecase.Create(context.Background(), newDriveTrain)
	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestCreate_Error(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	newDriveTrain := &models.CreateDriveTrainType{EN: "4WD", ES: "4x4"}
	mockRepo.On("Create", mock.AnythingOfType("*entities.DriveTrainType")).Return(errors.New("database error"))

	// Execute test
	err := usecase.Create(context.Background(), newDriveTrain)
	assert.Error(t, err)
	mockRepo.AssertExpectations(t)
}

func TestUpdate_Success(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	updateDriveTrain := &models.UpdateDriveTrainType{ID: uuid.New(), EN: "4WD", ES: "4x4"}
	mockRepo.On("Update", mock.AnythingOfType("*entities.DriveTrainType")).Return(nil)

	// Execute test
	customErr := usecase.Update(context.Background(), updateDriveTrain)
	assert.Nil(t, customErr)
	mockRepo.AssertExpectations(t)
}

func TestUpdate_Error(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	updateDriveTrain := &models.UpdateDriveTrainType{ID: uuid.New(), EN: "4WD", ES: "4x4"}
	mockRepo.On("Update", mock.AnythingOfType("*entities.DriveTrainType")).Return(errors.New("database error"))

	// Execute test
	customErr := usecase.Update(context.Background(), updateDriveTrain)

	assert.NotNil(t, customErr)

	assert.Equal(t, apierrors.DriveTrainTypeNotFound.Code, customErr.Code)
	mockRepo.AssertExpectations(t)
}

func TestDelete_Success(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	id := uuid.New()
	mockRepo.On("Delete", id).Return(nil)

	// Execute test
	err := usecase.Delete(context.Background(), id)
	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestDelete_Error(t *testing.T) {
	mockRepo := new(mocks.MockDriveTrainTypeRepository)
	usecase := usecases.NewDriveTrainTypeUsecaseImpl(mockRepo)

	id := uuid.New()
	mockRepo.On("Delete", id).Return(errors.New("database error"))

	// Execute test
	err := usecase.Delete(context.Background(), id)
	assert.Error(t, err)
	mockRepo.AssertExpectations(t)
}
