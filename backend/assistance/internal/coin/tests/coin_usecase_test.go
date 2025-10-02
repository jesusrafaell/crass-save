package tests

import (
	"testing"

	"bitbucket.org/mya/mya-assistance-core/internal/coin/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/tests/mocks"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetAllCoins(t *testing.T) {
	mockRepo := new(mocks.MockCoinRepository)

	mockCoins := []entities.Coin{
		{ID: uuid.New(), Key: 1, Name: "Dolar", Symbol: "$"},
		{ID: uuid.New(), Key: 2, Name: "Peso Colombiano", Symbol: "COL"},
	}

	mockRepo.On("GetAll").Return(&mockCoins, nil)

	coins, err := mockRepo.GetAll()

	assert.NoError(t, err)
	assert.Equal(t, mockCoins, *coins)

	mockRepo.AssertExpectations(t)
}
