package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockTowTruckRepository struct {
	mock.Mock
}

func (m *MockTowTruckRepository) GetAll(lang string) (*[]models.TowTruck, error) {
	args := m.Called(lang)
	if towTrucks, ok := args.Get(0).(*[]models.TowTruck); ok {
		return towTrucks, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) GetByID(id uuid.UUID) (*entities.TowTruck, error) {
	args := m.Called(id)
	if towTruck, ok := args.Get(0).(*entities.TowTruck); ok {
		return towTruck, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) Create(towTruck *entities.TowTruck) *apierrors.CustomError {
	args := m.Called(towTruck)
	return args.Get(0).(*apierrors.CustomError)
}

func (m *MockTowTruckRepository) Update(data *entities.TowTruck) *apierrors.CustomError {
	args := m.Called(data)
	return args.Get(0).(*apierrors.CustomError)
}

func (m *MockTowTruckRepository) Delete(id uuid.UUID) (error, bool) {
	args := m.Called(id)
	return args.Error(0), args.Bool(1)
}

func (m *MockTowTruckRepository) GetByLicensePlate(licensePlate string) (*entities.TowTruck, error) {
	args := m.Called(licensePlate)
	if towTruck, ok := args.Get(0).(*entities.TowTruck); ok {
		return towTruck, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*entities.TowTruck, error) {
	args := m.Called(insuranceID, policyNumber)
	if towTruck, ok := args.Get(0).(*entities.TowTruck); ok {
		return towTruck, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) GetByUserID(lang string, driverId uuid.UUID) (*[]models.TowTruck, error) {
	args := m.Called(lang, driverId)
	if towTrucks, ok := args.Get(0).(*[]models.TowTruck); ok {
		return towTrucks, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) GetOneByUserID(lang string, userID uuid.UUID) (*models.TowTruck, error) {
	args := m.Called(lang, userID)
	if towTruck, ok := args.Get(0).(*models.TowTruck); ok {
		return towTruck, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) DeactivateTowTrucks(ttId uuid.UUID, driverId uuid.UUID) error {
	args := m.Called(ttId, driverId)
	return args.Error(0)
}

func (m *MockTowTruckRepository) GetAllByCompanyId(lang string, companyId uuid.UUID) (*[]models.TowTruck, error) {
	args := m.Called(lang, companyId)
	if towTrucks, ok := args.Get(0).(*[]models.TowTruck); ok {
		return towTrucks, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) CreateExpenseHistory(data *entities.TowTruckExpenseHistory) *apierrors.CustomError {
	args := m.Called(data)
	if customErr, ok := args.Get(0).(*apierrors.CustomError); ok {
		return customErr
	}
	return nil
}

func (m *MockTowTruckRepository) GetExpenseHistoryByCompanyId(companyId uuid.UUID) (*[]entities.TowTruckExpenseHistory, error) {
	args := m.Called(companyId)
	if expenseHistories, ok := args.Get(0).(*[]entities.TowTruckExpenseHistory); ok {
		return expenseHistories, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTowTruckRepository) GetExpenseHistoryByTTId(ttId uuid.UUID, expenseType *uint) (*[]entities.TowTruckExpenseHistory, error) {
	args := m.Called(ttId, expenseType)
	if expenseHistories, ok := args.Get(0).(*[]entities.TowTruckExpenseHistory); ok {
		return expenseHistories, args.Error(1)
	}
	return nil, args.Error(1)
}
