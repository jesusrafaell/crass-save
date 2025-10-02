package models

import (
	"bitbucket.org/mya/mya-assistance-core/types"

	colorModel "bitbucket.org/mya/mya-assistance-core/internal/color/models"
	countryModel "bitbucket.org/mya/mya-assistance-core/internal/country/models"
	driveTrainTypeModel "bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"
	engineTypesModel "bitbucket.org/mya/mya-assistance-core/internal/enginetype/models"
	insuranceModel "bitbucket.org/mya/mya-assistance-core/internal/insurance/models"
	weightModel "bitbucket.org/mya/mya-assistance-core/internal/weight/models"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"

	"github.com/google/uuid"
)

// Base OBJ
type TowTruck struct {
	ID           uuid.UUID `json:"id" db:"id"`
	CreatedAt    int64     `json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt    int64     `json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt    *int64    `json:"deletedAt,omitempty" db:"deleted_at"`
	Year         uint      `db:"year" json:"year"`
	LicensePlate string    `db:"license_plate" json:"licensePlate"`
	PolicyNumber *string   `db:"policy_number" json:"policyNumber"`
	ImagePath    string    `db:"image_path" json:"imagePath"`
	Active       bool      `db:"active" json:"active"`

	DriverID *uuid.UUID      `db:"driver_id" json:"userId"`
	Driver   *userModel.User `db:"driver" json:"user,omitempty"`

	Make           *TowTruckMake                       `db:"make" json:"make,omitempty"`
	Type           *TowTruckType                       `db:"craneType" json:"craneType,omitempty"`
	Weight         *weightModel.Weight                 `db:"weight" json:"weight,omitempty"`
	EngineType     *engineTypesModel.EngineType        `db:"engineType" json:"engineType,omitempty"`
	Color          *colorModel.Color                   `db:"color" json:"color,omitempty"`
	DriveTrainType *driveTrainTypeModel.DriveTrainType `db:"driveTrainType" json:"driveTrainType,omitempty"`
	Insurance      *insuranceModel.Insurance           `db:"insurance" json:"insurance,omitempty"`
	Country        *countryModel.Country               `db:"country" json:"country,omitempty"`
	Company        *types.BaseKey                      `db:"company" json:"company,omitempty"`

	//deleted
	MaximumLoad uint `db:"maximum_load" json:"maximumLoad"`
	Length      uint `db:"length" json:"length"`
	Height      uint `db:"height" json:"height"`
}

// type TowTruckResponse struct {
// 	ID           uuid.UUID `json:"id"`
// 	CreatedAt    int64     `json:"createdAt"`
// 	UpdatedAt    int64     `json:"updatedAt"`
// 	Year         uint      `json:"year"`
// 	LicensePlate string    `json:"licensePlate"`
// 	PolicyNumber string    `json:"policyNumber"`
// 	ImagePath    string    `json:"imagePath"`
// 	Active       bool      `json:"active"`

// 	UserID *uuid.UUID  `json:"userId"`
// 	User   *model.User `json:"user,omitempty"`

// 	Company *types.BaseKey `db:"company" json:"company,omitempty"`

// 	Make           *TowTruckMake                       `json:"make,omitempty"`
// 	Type           *TowTruckType                       `json:"craneType"`
// 	Weight         *weightModel.Weight                 `json:"weight,omitempty"`
// 	EngineType     *engineTypesModel.EngineType        `json:"engineType,omitempty"`
// 	Color          *colorModel.Color                   `json:"color"`
// 	DriveTrainType *driveTrainTypeModel.DriveTrainType `json:"driveTrainType,omitempty"`
// 	Insurance      *insuranceModel.Insurance           `json:"insurance,omitempty"`
// 	Country        *countryModel.Country               `json:"country,omitempty"`

// 	//remove
// 	MaximumLoad float64 `json:"maximumLoad"`
// 	Length      float64 `json:"length"`
// 	Height      float64 `json:"height"`
// 	//
// }

type TowTruckDriver struct {
	ID           uuid.UUID         `json:"id"`
	Year         uint              `json:"year"`
	LicensePlate string            `json:"licensePlate"`
	ImagePath    string            `json:"imagePath"`
	Color        *colorModel.Color `json:"color"`
	Make         *TowTruckMake     `json:"make"`
	Type         *TowTruckType     `json:"craneType"`
	MaximumLoad  float64           `json:"maximumLoad"`
	Length       float64           `json:"length"`
	Height       float64           `json:"height"`
}

type CreateTowTruck struct {
	//headers
	CompanyId *uuid.UUID `json:"companyId"`
	UserID    *uuid.UUID `json:"userId"`

	//body
	DriverId         *uuid.UUID `json:"driverId"`
	PolicyNumber     *string    `json:"policyNumber"`
	Year             uint       `json:"year" validate:"required"`
	LicensePlate     string     `json:"licensePlate" validate:"required"`
	ImagePath        string     `json:"imagePath" validate:"required"`
	EngineTypeID     uuid.UUID  `json:"engineTypeId" validate:"required"`
	MakeID           uuid.UUID  `json:"makeId" validate:"required"`
	ColorID          uuid.UUID  `json:"colorId" validate:"required"`
	DriveTrainTypeID uuid.UUID  `json:"driveTrainTypeId" validate:"required"`
	WeightID         uuid.UUID  `json:"weightID" validate:"required"`
	CountryID        uuid.UUID  `json:"countryId" validate:"required"`
	TypeId           uuid.UUID  `json:"craneTypeId" validate:"required"`
	InsuranceID      *uuid.UUID `json:"insuranceId"`
}

type UpdateTowTruck struct {
	ID       uuid.UUID  `json:"id"`
	DriverId *uuid.UUID `json:"driverId"`

	RemoveDriver *bool `json:"removeDriver"`

	Year             *uint      `json:"year"`
	LicensePlate     *string    `json:"licensePlate"`
	ImagePath        *string    `json:"imagePath"`
	PolicyNumber     *string    `json:"policyNumber"`
	Active           *bool      `json:"active"`
	EngineTypeID     *uuid.UUID `json:"engineTypeId"`
	MakeID           *uuid.UUID `json:"makeId"`
	ColorID          *uuid.UUID `json:"colorId"`
	DriveTrainTypeID *uuid.UUID `json:"driveTrainTypeId"`
	WeightID         *uuid.UUID `json:"weightID"`
	InsuranceID      *uuid.UUID `json:"insuranceId"`
	CountryID        *uuid.UUID `json:"countryId"`
	TypeId           *uuid.UUID `json:"craneTypeId"`
}

type ErrorListTowTruck struct {
	LicensePlate string `json:"licensePlate"`
}

type AddExpenseTowTruckRequest struct {
	TowTruckId  uuid.UUID `json:"towTruckId" validate:"required"`
	UserID      uuid.UUID `json:"userId" validate:"required"`
	CompanyId   uuid.UUID `json:"companyId" validate:"required"`
	UnixDate    int64     `json:"unixDate" validate:"required"`
	Amount      float64   `json:"amount" validate:"required"`
	CoinId      uuid.UUID `json:"coinId" validate:"required"`      // coin (dollar,euro)
	ExpenseType uint      `json:"expenseType" validate:"required"` //1 or 2

	FuelLiters        *float64 `json:"fuelLiters"`
	RepairDescription *string  `json:"repairDescription"`
}
