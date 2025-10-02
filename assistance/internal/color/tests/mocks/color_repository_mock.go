package mocks

import (
	"bitbucket.org/mya/mya-assistance-core/internal/color/models"
	"github.com/stretchr/testify/mock"
)

type MockColorRepository struct {
	mock.Mock
}

func (m *MockColorRepository) GetAll(lang string) (*[]models.Color, error) {
	args := m.Called(lang)
	return args.Get(0).(*[]models.Color), args.Error(1)
}
