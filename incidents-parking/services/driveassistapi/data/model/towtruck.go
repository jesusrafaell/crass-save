package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TowTruck struct {
	//gorm.model
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64 `gorm:"index"`
	//
	Year         uint   `gorm:"column:year"`
	LicensePlate string `gorm:"type:varchar(100);unique"`
	PolicyNumber string `gorm:"column:policy_number"`
	ImagePath    string `gorm:"column:image_path;uniqueIndex"`
	//
	OwnerID   uuid.UUID `gorm:"foreignKey:UserID;column:owner_id"`
	OwnerType uint
	UserID    uuid.UUID `gorm:"foreignKey:UserID;column:user_id"`
	//
	MakeID           uuid.UUID `gorm:"foreignKey:MakeID;column:make_id"`
	Make             MakeTowTruck
	TypeMachineID    uuid.UUID   `gorm:"foreignKey:TypeMachineID;column:type_machine_id"`
	TypeMachine      TypeMachine //ok
	ColorID          uuid.UUID   `gorm:"foreignKey:ColorID;column:color_id"`
	Color            Color       //ok
	DriveTrainTypeID uuid.UUID   `gorm:"foreignKey:DriveTrainTypeID;column:dttype_id"`
	DriveTrainType   DriveTrainType
	InsuranceID      uuid.UUID `gorm:"foreignKey:InsuranceID;column:insurance_id"`
	Insurance        Insurance
	CountryID        uuid.UUID `gorm:"foreignKey:CountryID;column:country_id"`
	Country          Country
	//op
	WeightID uuid.UUID `gorm:"foreignKey:WeightID;column:weight_id"`
	Weight   Weight
	// new
	CraneTypeID uuid.UUID `gorm:"foreignKey:CraneTypeID;column:crane_type_id"`
	CraneType   CraneType
	MaximumLoad float64 `gorm:"column:maximum_load"` //capacity
	Active      bool    `gorm:"column:active"`
	Length      float64 `gorm:"column:length"`
	Height      float64 `gorm:"column:height"`
}

func (TowTruck) TableName() string {
	return "dat_towtruck"
}

func (m *TowTruck) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
