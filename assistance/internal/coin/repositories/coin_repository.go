package repositories

import (
	"log"

	"bitbucket.org/mya/mya-assistance-core/internal/coin/entities"
	"github.com/jmoiron/sqlx"
)

type CoinRepository interface {
	GetAll() (*[]entities.Coin, error)
}

type coinRepository struct {
	db *sqlx.DB
}

func NewCoinsRepository(db *sqlx.DB) CoinRepository {
	return &coinRepository{db: db}
}

func (r *coinRepository) GetAll() (*[]entities.Coin, error) {
	var responseList []entities.Coin

	query := "SELECT id, key, name, symbol FROM coins ORDER BY key ASC"

	err := r.db.Select(&responseList, query)
	if err != nil {
		log.Printf("Error coins.GetAll: %v", err)
		return nil, err
	}

	return &responseList, nil
}
