// File: mocks/mock_tow_truck_types_repository.go
package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// Mock of TowTruckTypesRepository interface
type MockTowTruckTypesRepository struct {
	mock.Mock
}

func (m *MockTowTruckTypesRepository) GetByID(lang string, id uuid.UUID) (*models.TowTruckType, error) {
	args := m.Called(lang, id)
	if towTruckType, ok := args.Get(0).(*models.TowTruckType); ok {
		return towTruckType, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckTypesRepository) GetByNames(en, es string) (*models.TowTruckType, error) {
	args := m.Called(en, es)
	if towTruckType, ok := args.Get(0).(*models.TowTruckType); ok {
		return towTruckType, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckTypesRepository) Create(data *entities.TowTruckType) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockTowTruckTypesRepository) GetAll(lang string) (*[]models.TowTruckType, error) {
	args := m.Called(lang)
	if list, ok := args.Get(0).(*[]models.TowTruckType); ok {
		return list, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckTypesRepository) Update(data *entities.TowTruckType) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockTowTruckTypesRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}
