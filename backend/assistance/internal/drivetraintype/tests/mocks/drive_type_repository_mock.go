package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// MockDriveTrainTypeRepository is a mock implementation of the DriveTrainTypeRepository interface
type MockDriveTrainTypeRepository struct {
	mock.Mock
}

func (m *MockDriveTrainTypeRepository) GetByID(lang string, id uuid.UUID) (*models.DriveTrainType, error) {
	args := m.Called(lang, id)
	if driveTrainType, ok := args.Get(0).(*models.DriveTrainType); ok {
		return driveTrainType, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockDriveTrainTypeRepository) Create(driveTrainType *entities.DriveTrainType) error {
	args := m.Called(driveTrainType)
	return args.Error(0)
}

func (m *MockDriveTrainTypeRepository) GetAll(lang string) (*[]models.DriveTrainType, error) {
	args := m.Called(lang)
	if driveTrainTypes, ok := args.Get(0).(*[]models.DriveTrainType); ok {
		return driveTrainTypes, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockDriveTrainTypeRepository) Update(driveTrainType *entities.DriveTrainType) error {
	args := m.Called(driveTrainType)
	return args.Error(0)
}

func (m *MockDriveTrainTypeRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}
