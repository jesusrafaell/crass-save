package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RequestDriver struct {
	ID            uuid.UUID `db:"id" json:"id"`
	DriverID      uuid.UUID `db:"driver_id" json:"driverId"`
	RequestID     uuid.UUID `db:"request_id" json:"requestId"`
	CreatedAt     int64     `db:"created_at" json:"createdAt"`
	ExpiredAt     int64     `db:"expired_at" json:"expiredAt"`
	DriverToUser  float64   `db:"driver_to_user" json:"driverToUser"`
	TotalDistance float64   `db:"total_distance" json:"totalDistance"`
	Price         float64   `db:"price" json:"price"`
	CoinID        uuid.UUID `db:"coin_id" json:"coinId"`
}

func (RequestDriver) TableName() string {
	return "a_request_drivers"
}

func (r *RequestDriver) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if r.CreatedAt == 0 {
		r.CreatedAt = now
	}
	if r.ExpiredAt == 0 {
		// Set ExpiredAt to 5 minutes (300 seconds) after now
		r.ExpiredAt = now + 300
	}
	return
}

//--add  fk
// ALTER TABLE public.a_request_drivers
// ADD CONSTRAINT fk_driver_id FOREIGN KEY (driver_id)
// REFERENCES public.u_users (id)
// ON UPDATE NO ACTION
// ON DELETE NO ACTION;
// ALTER TABLE public.a_request_drivers
// ADD COLUMN driver_to_user FLOAT8 NOT NULL,
// ADD COLUMN total_distance FLOAT8 NOT NULL,
// ADD COLUMN price FLOAT8 NOT NULL,
// ADD COLUMN coin_id UUID NOT NULL,
// ADD CONSTRAINT fk_coin_id FOREIGN KEY (coin_id)
//     REFERENCES public.coins (id);

// type RequestDriver struct {
// 	ID        uuid.UUID `db:"id" gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
// 	DriverID  uuid.UUID `db:"driver_id" gorm:"type:uuid;column:driver_id;not null"`
// 	RequestID uuid.UUID `db:"request_id" gorm:"type:uuid;column:request_id;not null"`
// 	CreatedAt int64     `db:"created_at" gorm:"column:created_at;not null"`
// 	ExpiredAt int64     `db:"expired_at" gorm:"column:expired_at;not null"`
// }
