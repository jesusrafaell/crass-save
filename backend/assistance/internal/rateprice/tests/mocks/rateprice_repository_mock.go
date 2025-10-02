package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockRatePriceRepository struct {
	mock.Mock
}

func (m *MockRatePriceRepository) GetByID(id uuid.UUID) (*entities.RatePriceXType, error) {
	args := m.Called(id)
	if ratePrice, ok := args.Get(0).(*entities.RatePriceXType); ok {
		return ratePrice, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRatePriceRepository) GetByKey(key uint) (*entities.RatePriceXType, error) {
	args := m.Called(key)
	if ratePrice, ok := args.Get(0).(*entities.RatePriceXType); ok {
		return ratePrice, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRatePriceRepository) GetAll(lang string) (*[]entities.RatePriceXType, error) {
	args := m.Called(lang)
	if ratePrices, ok := args.Get(0).(*[]entities.RatePriceXType); ok {
		return ratePrices, args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockRatePriceRepository) Update(data *entities.RatePriceXType) error {
	args := m.Called(data)
	return args.Error(0)
}

func (m *MockRatePriceRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockRatePriceRepository) GetPriceXKm(lang string, vType uuid.UUID, distanceKm float64) (*models.Price, error) {
	args := m.Called(lang, vType, distanceKm)
	if price, ok := args.Get(0).(*models.Price); ok {
		return price, args.Error(1)
	}
	return nil, args.Error(1)
}
