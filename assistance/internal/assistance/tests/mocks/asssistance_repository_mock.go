package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/preloads"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// MockAssistanceRepository is a mock implementation of the AssistanceRepository interface.
type MockAssistanceRepository struct {
	mock.Mock
}

func (m *MockAssistanceRepository) Create(data *entities.Assistance) *apierrors.CustomError {
	args := m.Called(data)
	if err := args.Get(0); err != nil {
		return err.(*apierrors.CustomError)
	}
	return nil
}

func (m *MockAssistanceRepository) GetAll() (*[]entities.Assistance, error) {
	args := m.Called()
	if args.Get(0) != nil {
		return args.Get(0).(*[]entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) Update(data *entities.Assistance) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockAssistanceRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockAssistanceRepository) GetByID(id uuid.UUID, options ...preloads.PreloadOption) (*entities.Assistance, error) {
	args := m.Called(id, options)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetByUserORDriver(userId, driverId *uuid.UUID) (*entities.Assistance, error) {
	args := m.Called(userId, driverId)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetByFilter(reqId, userId, driverId *uuid.UUID) (*entities.Assistance, error) {
	args := m.Called(reqId, userId, driverId)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetPendingByDriverID(driverID uuid.UUID) (*[]entities.Assistance, error) {
	args := m.Called(driverID)
	if args.Get(0) != nil {
		return args.Get(0).(*[]entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetByUserAndStatus(userId, statusID uuid.UUID) (*entities.Assistance, error) {
	args := m.Called(userId, statusID)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) ValidStatusRequest(userId, driverId *uuid.UUID) (*entities.Assistance, error) {
	args := m.Called(userId, driverId)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetDashboardDataByCompany(companyId *uuid.UUID) (*models.DashboarData, error) {
	args := m.Called(companyId)
	if args.Get(0) != nil {
		return args.Get(0).(*models.DashboarData), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetAllByCompanyId(companyId *uuid.UUID, filter *models.FilterDashboardRequest) (*[]entities.Assistance, error) {
	args := m.Called(companyId, filter)
	if args.Get(0) != nil {
		return args.Get(0).(*[]entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetList(filter *models.ParamsRequestGet) (*[]entities.Assistance, error) {
	args := m.Called(filter)
	if args.Get(0) != nil {
		return args.Get(0).(*[]entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAssistanceRepository) GetByUserMobile(mobile string) (*entities.Assistance, error) {
	args := m.Called(mobile)
	if args.Get(0) != nil {
		return args.Get(0).(*entities.Assistance), args.Error(1)
	}
	return nil, args.Error(1)
}
