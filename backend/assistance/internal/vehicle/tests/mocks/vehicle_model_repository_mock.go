package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type ModelRepository struct {
	mock.Mock
}

func (m *ModelRepository) Create(data *models.VehicleModel, makeID uuid.UUID) error {
	args := m.Called(data, makeID)
	return args.Error(0)
}

func (m *ModelRepository) GetAll() (*[]models.VehicleModel, error) {
	args := m.Called()
	if models, ok := args.Get(0).(*[]models.VehicleModel); ok {
		return models, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *ModelRepository) GetByMakeID(makeID uuid.UUID) (*[]models.VehicleModel, error) {
	args := m.Called(makeID)
	if models, ok := args.Get(0).(*[]models.VehicleModel); ok {
		return models, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *ModelRepository) Update(data *models.VehicleModel) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *ModelRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *ModelRepository) GetByMakeName(makeName string) (*[]models.VehicleModel, error) {
	args := m.Called(makeName)
	// Cast the returned arguments to the expected return types
	if models, ok := args.Get(0).(*[]models.VehicleModel); ok {
		return models, args.Error(1)
	}
	return nil, args.Error(1)
}
