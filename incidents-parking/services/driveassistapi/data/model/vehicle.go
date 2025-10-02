package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Vehicle struct {
	//gorm.model
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()"`
	CreatedAt int64
	UpdatedAt int64
	DeletedAt int64 `gorm:"index"`
	//
	BrandID          uuid.UUID `gorm:"foreignKey:BrandID;column:brand_id"`
	Brand            Brand
	ModelID          uuid.UUID `gorm:"foreignKey:ModelID;column:model_id"`
	Model            Model
	Year             uint      `gorm:"column:year"`
	Tuition          string    `gorm:"type:varchar(100);unique"`
	PolicyNumber     string    `gorm:"column:policy_number"`
	ImagePath        string    `gorm:"column:image_path;uniqueIndex"`
	UserID           uuid.UUID `gorm:"foreignKey:UserID;column:user_id"`
	TypeID           uuid.UUID `gorm:"foreignKey:TypeID;column:type_id"`
	Type             Type
	TypeMachineID    uuid.UUID `gorm:"foreignKey:TypeMachineID;column:type_machine_id"`
	TypeMachine      TypeMachine
	WeightID         uuid.UUID `gorm:"foreignKey:WeightID;column:weight_id"`
	Weight           Weight
	ColorID          uuid.UUID `gorm:"foreignKey:ColorID;column:color_id"`
	Color            Color
	DriveTrainTypeID uuid.UUID `gorm:"foreignKey:DriveTrainTypeID;column:dttype_id"`
	DriveTrainType   DriveTrainType
	InsuranceID      uuid.UUID `gorm:"foreignKey:InsuranceID;column:insurance_id"`
	Insurance        Insurance
	CountryID        uuid.UUID `gorm:"foreignKey:CountryID;column:country_id"`
	Country          Country
}

func (Vehicle) TableName() string {
	return "dat_vehicle"
}

func (m *Vehicle) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}
