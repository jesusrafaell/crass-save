package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/coin/models"

	"github.com/google/uuid"
)

type Coin struct {
	ID     uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	Key    uint      `db:"key" json:"key"`
	Name   string    `db:"name" json:"name"`
	Symbol string    `db:"symbol" json:"symbol"`
	// CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	// UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	// DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
}

func (Coin) TableName() string {
	return "coins"
}

func ConvertToCoinResponse(coin *Coin) *models.Coin {
	if coin == nil {
		return nil
	}
	return &models.Coin{
		ID:     coin.ID,
		Key:    coin.Key,
		Name:   coin.Name,
		Symbol: coin.Symbol,
	}
}
