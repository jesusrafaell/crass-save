package types

import (
	"crashsaver/parking/data"

	"github.com/google/uuid"
)

type CreateParking struct {
	Country        string                  `json:"country"`
	Name           string                  `json:"name"`
	Address        string                  `json:"address"`
	Language       string                  `json:"language"`
	Latitude       float64                 `json:"latitude"`
	Longitude      float64                 `json:"longitude"`
	AvailableSpace int32                   `json:"availableSpace"`
	Emails         []string                `json:"emails"`
	ServicesIds    []uuid.UUID             `json:"servicesIds"`
	Hours          data.PkPriceXHoursArray `json:"hours"` //{hours: int, price: float64}
}
