package types

import "github.com/google/uuid"

type VehicleRequest struct {
	Year             uint      `json:"year" validate:"required"`
	Tuition          string    `json:"tuition" validate:"required"`
	PolicyNumber     string    `json:"policyNumber" validate:"required"`
	ImagePath        string    `json:"imagePath" validate:"required"`
	UserID           uuid.UUID `json:"userId" validate:"required"`
	ColorID          uuid.UUID `json:"colorId" validate:"required"`
	BrandID          uuid.UUID `json:"brandId" validate:"required"`
	ModelID          uuid.UUID `json:"modelId" validate:"required"`
	TypeID           uuid.UUID `json:"typeId" validate:"required"`
	DriveTrainTypeID uuid.UUID `json:"driveTrainTypeId" validate:"required"`
	TypeMachineID    uuid.UUID `json:"typeMachineId" validate:"required"`
	WeightID         uuid.UUID `json:"weightID" validate:"required"`
	InsuranceID      uuid.UUID `json:"insuranceId" validate:"required"`
	CountryID        uuid.UUID `json:"countryId" validate:"required"`
}

type VehicleResponse struct {
	ID             uuid.UUID `json:"id"`
	UserID         uuid.UUID `json:"userId"`
	Year           uint      `json:"year"`
	Tuition        string    `json:"tuition"`
	PolicyNumber   string    `json:"policyNumber"`
	ImagePath      string    `json:"imagePath"`
	CreatedAt      int64     `json:"createAt"`
	UpdatedAt      int64     `json:"updateAt"`
	Color          BaseColor `json:"color"`
	Weight         BaseName  `json:"weight"`
	Brand          BaseName  `json:"brand"`
	Model          BaseName  `json:"model"`
	Type           BaseName  `json:"type"`
	Country        BaseName  `json:"country"`
	TypeMachine    BaseName  `json:"typeMachine"`
	DriveTrainType BaseName  `json:"driveTrainType"`
	Insurance      BaseName  `json:"insurance"`
}
