package types

import "github.com/google/uuid"

type TowTruckRequest struct {
	Year             uint      `json:"year" validate:"required"`
	LicensePlate     string    `json:"licensePlate" validate:"required"`
	PolicyNumber     string    `json:"policyNumber" validate:"required"`
	ImagePath        string    `json:"imagePath" validate:"required"`
	OwnerID          uuid.UUID `json:"ownerId" validate:"required"`
	UserID           uuid.UUID `json:"userId" validate:"required"`
	MakeID           uuid.UUID `json:"makeId" validate:"required"`
	TypeMachineID    uuid.UUID `json:"typeMachineId" validate:"required"`
	ColorID          uuid.UUID `json:"colorId" validate:"required"`
	DriveTrainTypeID uuid.UUID `json:"driveTrainTypeId" validate:"required"`
	InsuranceID      uuid.UUID `json:"insuranceId" validate:"required"`
	CountryID        uuid.UUID `json:"countryId" validate:"required"`
	WeightID         uuid.UUID `json:"weightID" validate:"required"`
	CraneTypeID      uuid.UUID `json:"craneTypeId" validate:"required"`
	MaximumLoad      float64   `json:"maximumLoad" validate:"required"`
	Length           float64   `json:"length" validate:"required"`
	Height           float64   `json:"height" validate:"required"`
}

type TowTruckResponse struct {
	ID             uuid.UUID `json:"id"`
	Year           uint      `json:"year"`
	LicensePlate   string    `json:"licensePlate"`
	PolicyNumber   string    `json:"policyNumber"`
	ImagePath      string    `json:"imagePath"`
	UserID         uuid.UUID `json:"userId"`
	OwnerID        uuid.UUID `json:"ownerId"`
	Color          BaseColor `json:"color"`
	Weight         BaseName  `json:"weight"`
	Make           BaseName  `json:"Make"`
	CraneType      BaseName  `json:"craneType"`
	Country        BaseName  `json:"country"`
	TypeMachine    BaseName  `json:"typeMachine"`
	DriveTrainType BaseName  `json:"driveTrainType"`
	Insurance      BaseName  `json:"insurance"`
	MaximumLoad    float64   `json:"maximumLoad"`
	Length         float64   `json:"length"`
	Height         float64   `json:"height"`
	CreatedAt      int64     `json:"createAt"`
	UpdatedAt      int64     `json:"updateAt"`
}
