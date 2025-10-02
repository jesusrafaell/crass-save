package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/coin/entities"
	"github.com/stretchr/testify/mock"
)

type MockCoinRepository struct {
	mock.Mock
}

func (m *MockCoinRepository) GetAll() (*[]entities.Coin, error) {
	args := m.Called()
	return args.Get(0).(*[]entities.Coin), args.Error(1)
}
