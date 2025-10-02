package models

import (
	"bitbucket.org/mya/mya-assistance-core/types"

	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"github.com/google/uuid"
)

type Price struct {
	Km float64 `db:"km" json:"km"`
	// Meters      *float64       `db:"meters" json:"meters"`
	PriceKm     float64        `db:"proce_km" json:"priceKm"`
	Coin        coinModel.Coin `db:"coin" json:"coin,omitempty"`
	VehicleType *types.BaseKey `db:"vehicleType" json:"type,omitempty"`
}

type RatesPrices struct {
	ID      uuid.UUID       `db:"id"              json:"id"`
	Km      float64         `db:"km"              json:"km"`
	PriceKm float64         `db:"price_km"        json:"priceKm"`
	Key     string          `db:"key"             json:"key"`
	CoinID  uuid.UUID       `db:"coin_id"         json:"coinId"`
	Coin    *coinModel.Coin `db:"coin"            json:"coin,omitempty"`
}

type VTypesAndRatePrices struct {
	Type           types.BaseKey `json:"type"`
	RatePriceXType []RatesPrices `json:"prices,omitempty"`
}

type TypeRatePrices struct {
	KeysKm     []float64             `json:"keysKm"`
	RatePrices []VTypesAndRatePrices `json:"ratePrices"`
}

type UpdateRatePriceXType struct {
	CreatedAt int64     `json:"createdAt,omitempty"`
	UpdatedAt int64     `json:"updatedAt,omitempty"`
	DeletedAt *int64    `json:"deletedAt,omitempty"`
	Km        float64   `json:"km"`
	PriceKm   float64   `json:"priceKm"`
	Key       string    `json:"key"`
	TypeID    uuid.UUID `json:"typeId"`
	Base      float64   `json:"base"`
	CoinID    uuid.UUID `json:"coinId"`
}

const (
	KmMinimumKey    = "km-minimum"
	KmAdditionalKey = "km-additional"
)

type GetPriceXKmRequest struct {
	TypeId         uuid.UUID `json:"typeId" validate:"required"`
	DistanceMeters float64   `json:"distanceMeters" validate:"required"`
}
