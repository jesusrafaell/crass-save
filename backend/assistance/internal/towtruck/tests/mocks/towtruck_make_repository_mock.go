package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockTowTruckMakesRepository struct {
	mock.Mock
}

func (m *MockTowTruckMakesRepository) GetByID(id uuid.UUID) (*models.TowTruckMake, error) {
	args := m.Called(id)
	if towTruckMake, ok := args.Get(0).(*models.TowTruckMake); ok {
		return towTruckMake, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckMakesRepository) GetByName(name string) (*models.TowTruckMake, error) {
	args := m.Called(name)
	if towTruckMake, ok := args.Get(0).(*models.TowTruckMake); ok {
		return towTruckMake, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckMakesRepository) Create(data *entities.TowTruckMake) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockTowTruckMakesRepository) GetAll() (*[]models.TowTruckMake, error) {
	args := m.Called()
	if list, ok := args.Get(0).(*[]models.TowTruckMake); ok {
		return list, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckMakesRepository) Update(data *entities.TowTruckMake) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockTowTruckMakesRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}
