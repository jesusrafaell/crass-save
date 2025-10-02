package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockVehicleRepository struct {
	mock.Mock
}

func (m *MockVehicleRepository) Create(vehicle *entities.Vehicle) *apierrors.CustomError {
	args := m.Called(vehicle)
	if customErr, ok := args.Get(0).(*apierrors.CustomError); ok {
		return customErr
	}
	return nil
}

func (m *MockVehicleRepository) GetAll(lang string) (*[]models.Vehicle, error) {
	args := m.Called(lang)
	if vehicles, ok := args.Get(0).(*[]models.Vehicle); ok {
		return vehicles, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockVehicleRepository) GetById(id uuid.UUID) (*entities.Vehicle, error) {
	args := m.Called(id)
	if vehicle, ok := args.Get(0).(*entities.Vehicle); ok {
		return vehicle, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockVehicleRepository) Update(vehicle *entities.Vehicle) error {
	args := m.Called(vehicle)
	return args.Error(0)
}

func (m *MockVehicleRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockVehicleRepository) GetByUserId(lang string, userID uuid.UUID) (*[]models.Vehicle, error) {
	args := m.Called(lang, userID)
	if vehicles, ok := args.Get(0).(*[]models.Vehicle); ok {
		return vehicles, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockVehicleRepository) GetByLicensePlate(licensePlate string) (*entities.Vehicle, error) {
	args := m.Called(licensePlate)
	if vehicle, ok := args.Get(0).(*entities.Vehicle); ok {
		return vehicle, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockVehicleRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*entities.Vehicle, error) {
	args := m.Called(insuranceID, policyNumber)
	if vehicle, ok := args.Get(0).(*entities.Vehicle); ok {
		return vehicle, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockVehicleRepository) DeactivateVehicles(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}
