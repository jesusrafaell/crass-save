package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

// MockRequestDriverRepository is a mock implementation of the RequestDriverRepository interface.
type MockRequestDriverRepository struct {
	mock.Mock
}

// Create simulates inserting a new RequestDriver record.
func (m *MockRequestDriverRepository) Create(data *models.RequestDriver) error {
	args := m.Called(data)
	return args.Error(0)
}

// GetByRequestID simulates retrieving RequestDriver records by request ID.
func (m *MockRequestDriverRepository) GetByRequestID(reqID uuid.UUID) (*[]models.RequestDriver, error) {
	args := m.Called(reqID)
	if args.Get(0) != nil {
		return args.Get(0).(*[]models.RequestDriver), args.Error(1)
	}
	return nil, args.Error(1)
}

// GetByDriverID simulates retrieving RequestDriver records by driver ID.
func (m *MockRequestDriverRepository) GetByDriverID(driverID uuid.UUID) (*[]models.RequestDriver, error) {
	args := m.Called(driverID)
	if args.Get(0) != nil {
		return args.Get(0).(*[]models.RequestDriver), args.Error(1)
	}
	return nil, args.Error(1)
}

// GetByDriverIDAndReqID simulates retrieving a single RequestDriver record by driver and request ID.
func (m *MockRequestDriverRepository) GetByDriverIDAndReqID(driverID uuid.UUID, reqID uuid.UUID) (*models.RequestDriver, error) {
	args := m.Called(driverID, reqID)
	if args.Get(0) != nil {
		return args.Get(0).(*models.RequestDriver), args.Error(1)
	}
	return nil, args.Error(1)
}

// DeleteByReqID simulates deleting RequestDriver records by request ID.
func (m *MockRequestDriverRepository) DeleteByReqID(reqID uuid.UUID) error {
	args := m.Called(reqID)
	return args.Error(0)
}
