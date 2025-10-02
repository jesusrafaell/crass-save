package model

import (
	"database/sql/driver"
	"fmt"
)

type LocationPointer struct {
	Lat float64 `db:"latitude" json:"latitude" gorm:"column:latitude"`
	Lng float64 `db:"longitude" json:"longitude" gorm:"column:longitude"`
}

func (l LocationPointer) Value() (driver.Value, error) {
	return fmt.Sprintf("POINT(%f %f)", l.Lng, l.Lat), nil
}

// Convert
func (l *LocationPointer) Scan(value interface{}) error {
	var point string
	switch v := value.(type) {
	case []byte:
		point = string(v)
	case string:
		point = v
	default:
		return fmt.Errorf("cannot scan %T into Location", value)
	}

	_, err := fmt.Sscanf(point, "POINT(%f %f)", &l.Lng, &l.Lat)
	if err != nil {
		return err
	}

	return nil
}
