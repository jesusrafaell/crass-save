package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MakeRepository struct {
	mock.Mock
}

func (m *MakeRepository) GetByID(id uuid.UUID) (*models.VehicleMake, error) {
	args := m.Called(id)
	if obj, ok := args.Get(0).(*models.VehicleMake); ok {
		return obj, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MakeRepository) GetByName(name string) (*models.VehicleMake, error) {
	args := m.Called(name)
	if obj, ok := args.Get(0).(*models.VehicleMake); ok {
		return obj, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MakeRepository) Create(make *entities.VehicleMake) error {
	args := m.Called(make)
	return args.Error(0)
}

func (m *MakeRepository) GetAll() (*[]models.VehicleMake, error) {
	args := m.Called()
	if obj, ok := args.Get(0).(*[]models.VehicleMake); ok {
		return obj, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MakeRepository) Update(make *models.VehicleMake) error {
	args := m.Called(make)
	return args.Error(0)
}

func (m *MakeRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MakeRepository) GetByModelID(modelID uuid.UUID) (*models.VehicleMake, error) {
	args := m.Called(modelID)
	if obj, ok := args.Get(0).(*models.VehicleMake); ok {
		return obj, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MakeRepository) GetVehicleMakeAndModelByNames(vehicleMake, vehicleModel *string) (*models.VehicleMakeAndModel, error) {
	args := m.Called(&vehicleMake, &vehicleModel)

	// Cast the returned arguments to the expected types
	result, _ := args.Get(0).(*models.VehicleMakeAndModel)
	err := args.Error(1)
	return result, err
}
