package models

import (
	colorModel "bitbucket.org/mya/mya-assistance-core/internal/color/models"
	countryModel "bitbucket.org/mya/mya-assistance-core/internal/country/models"
	driveTrainTypeModel "bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"
	engineTypesModel "bitbucket.org/mya/mya-assistance-core/internal/enginetype/models"
	insuranceModel "bitbucket.org/mya/mya-assistance-core/internal/insurance/models"
	weightModel "bitbucket.org/mya/mya-assistance-core/internal/weight/models"

	"github.com/google/uuid"
)

type Vehicle struct {
	ID           uuid.UUID `json:"id" db:"id"`
	CreatedAt    int64     `json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt    int64     `json:"updatedAt,omitempty" db:"updated_at"`
	UserID       uuid.UUID `db:"user_id" json:"userId"`
	Year         uint      `db:"year" json:"year"`
	LicensePlate string    `db:"license_plate" json:"licensePlate"`
	PolicyNumber *string   `db:"policy_number" json:"policyNumber"`
	ImagePath    string    `db:"image_path" json:"imagePath"`
	Active       bool      `db:"active" json:"active"`
	//FK
	Make           *VehicleMake                        `db:"make" json:"make,omitempty"`
	Model          *VehicleModel                       `db:"model" json:"model,omitempty"`
	Type           *VehicleType                        `db:"type" json:"type,omitempty"`
	Weight         *weightModel.Weight                 `db:"weight" json:"weight,omitempty"`
	EngineType     *engineTypesModel.EngineType        `db:"engineType" json:"engineType,omitempty"`
	Color          *colorModel.Color                   `db:"color" json:"color"`
	DriveTrainType *driveTrainTypeModel.DriveTrainType `db:"driveTrainType" json:"driveTrainType,omitempty"`
	Insurance      *insuranceModel.Insurance           `db:"insurance" json:"insurance,omitempty"`
	Country        *countryModel.Country               `db:"country" json:"country,omitempty"`
}

type VehicleUser struct {
	ID             uuid.UUID                           `json:"id"`
	Year           uint                                `json:"year"`
	LicensePlate   string                              `json:"licensePlate"`
	ImagePath      string                              `json:"imagePath"`
	Make           *VehicleMake                        `json:"make,omitempty"`
	Model          *VehicleModel                       `json:"model,omitempty"`
	Type           *VehicleType                        `json:"type,omitempty"`
	Color          *colorModel.Color                   `json:"color"`
	Weight         *weightModel.Weight                 `json:"weight,omitempty"`
	EngineType     *engineTypesModel.EngineType        `json:"engineType,omitempty"`
	DriveTrainType *driveTrainTypeModel.DriveTrainType `json:"driveTrainType,omitempty"`
}
