package data

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

type Parking struct {
	ID             uuid.UUID          `json:"id"`
	Country        string             `json:"country"`
	Name           string             `json:"name"`
	Address        string             `json:"address"`
	Latitude       float64            `json:"latitude"`
	Longitude      float64            `json:"longitude"`
	AvailableSpace int32              `json:"availableSpace" db:"availableSpace"`
	Emails         StringArray        `json:"emails" db:"emails"`
	Services       PkServiceArray     `json:"services" db:"services"`
	Hours          PkPriceXHoursArray `json:"hours" db:"hours"`
	Language       string             `json:"language" db:"language"`
	// Price          float64   `json:"price"`
	// Email          string             `json:"email" db:"email"`
}

type PkPriceXHours struct {
	Hours uint    `db:"hours" json:"hours"`
	Price float64 `db:"price" json:"price"`
}

type StringArray []string

func (a *StringArray) Scan(src interface{}) error {
	if src == nil {
		*a = nil
		return nil
	}

	switch src := src.(type) {
	case []byte:
		return json.Unmarshal(src, a)
	case string:
		return json.Unmarshal([]byte(src), a)
	default:
		return errors.New("unsupported data type for StringArray")
	}
}

func (a StringArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}

type PkServiceArray []*PkService

func (a *PkServiceArray) Scan(src interface{}) error {
	if src == nil {
		*a = nil
		return nil
	}

	switch src := src.(type) {
	case []byte:
		return json.Unmarshal(src, a)
	case string:
		return json.Unmarshal([]byte(src), a)
	default:
		return errors.New("unsupported data type for PkServiceArray")
	}
}

func (a PkServiceArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}

type PkPriceXHoursArray []*PkPriceXHours

func (a *PkPriceXHoursArray) Scan(src interface{}) error {
	if src == nil {
		*a = nil
		return nil
	}

	switch src := src.(type) {
	case []byte:
		return json.Unmarshal(src, a)
	case string:
		return json.Unmarshal([]byte(src), a)
	default:
		return errors.New("unsupported data type for PkPriceXHoursArray")
	}
}

func (a PkPriceXHoursArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}
