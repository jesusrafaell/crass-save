package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/coin/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/repositories"
)

type CoinUsecase interface {
	GetAll(ctx context.Context) (*[]models.Coin, error)
}

type coinUsecaseImpl struct {
	repository repositories.CoinRepository
}

func NewCoinUsecaseImpl(repository repositories.CoinRepository) CoinUsecase {
	return &coinUsecaseImpl{
		repository: repository,
	}
}

func (u *coinUsecaseImpl) GetAll(ctx context.Context) (*[]models.Coin, error) {
	coins, err := u.repository.GetAll()
	if err != nil {
		return nil, err
	}

	coinsResponse := make([]models.Coin, len(*coins))

	for i, coin := range *coins {
		coinsResponse[i] = *entities.ConvertToCoinResponse(&coin)
	}

	return &coinsResponse, nil
}
