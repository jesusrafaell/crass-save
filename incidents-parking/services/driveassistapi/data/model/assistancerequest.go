package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AssistanceRequest struct {
	//gorm.model
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64 `gorm:"index"`

	//Origen User
	UserID    uuid.UUID `gorm:"foreignKey:UserID;column:user_id"`
	VehicleID uuid.UUID `gorm:"foreignKey:VehicleID;column:vehicle_id"`
	Vehicle   Vehicle
	//location
	UserLat  float64 `gorm:"column:user_latitude"`
	UserLong float64 `gorm:"column:user_longitude"`
	//img
	ImagePath1 string `gorm:"column:image_path_1;uniqueIndex"`
	ImagePath2 string `gorm:"column:image_path_2;uniqueIndex"`

	//Destiny request
	Latitude    float64 `gorm:"column:latitude"`
	Longitude   float64 `gorm:"column:longitude"`
	Address     string  `gorm:"address"`
	Description string  `gomr:"description"`

	//General
	StatusID       uuid.UUID `gorm:"foreignKey:StatusID;column:status_id"`
	Status         Status
	DistanceToUser float64   `gorm:"column:distance_user"`
	DistanceToDes  float64   `gorm:"column:distance_dest"`
	Price          float64   `gorm:"column:price"`
	Active         bool      `gorm:"column:active"`
	InsuranceID    uuid.UUID `gorm:"foreignKey:InsuranceID;column:insurance_id"`
	Insurance      Insurance

	//tow truck asinate after
	TowTruckDriveID *uuid.UUID `gorm:"foreignKey:UserID;column:user_id"`
	TowTruckID      *uuid.UUID `gorm:"foreignKey:TowTruckID;column:tow_truck_id"`
	TowTruck        *TowTruck
	DriverLat       float64 `gorm:"column:driver_latitude"`
	DriverLong      float64 `gorm:"column:driver_longitude"`
	ImagePath3      *string `gorm:"column:image_path_3;uniqueIndex"`
	ImagePath4      *string `gorm:"column:image_path_4;uniqueIndex"`
}

func (AssistanceRequest) TableName() string {
	return "dat_assistancerequest"
}

func (m *AssistanceRequest) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
