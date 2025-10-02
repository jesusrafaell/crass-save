package entities

import (
	"bitbucket.org/mya/mya-assistance-core/types"

	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"github.com/google/uuid"
)

type RatePriceXType struct {
	ID      uuid.UUID       `db:"id"              json:"id"`
	Km      float64         `db:"km"              json:"km"`
	PriceKm float64         `db:"price_km"        json:"priceKm"`
	Key     string          `db:"key"             json:"key"`
	TypeID  uuid.UUID       `db:"vehicle_type_id" json:"typeId"`
	Base    float64         `db:"base"            json:"base"`
	Type    *types.BaseKey  `db:"type"            json:"type,omitempty"`
	CoinID  uuid.UUID       `db:"coin_id"         json:"coinId"`
	Coin    *coinModel.Coin `db:"coin"            json:"coin,omitempty"`
	// CreatedAt int64           `db:"created_at"      json:"createdAt,omitempty"`
	// UpdatedAt int64           `db:"updated_at"      json:"updatedAt,omitempty"`
}

func (RatePriceXType) TableName() string {
	return "a_rate_price_x_type"
}
