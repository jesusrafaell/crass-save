package models

import "github.com/google/uuid"

type UpdateVehicle struct {
	ID               uuid.UUID  `json:"id"`
	Year             *uint      `json:"year"`
	LicensePlate     *string    `json:"licensePlate"`
	PolicyNumber     *string    `json:"policyNumber"`
	ImagePath        *string    `json:"imagePath"`
	UserID           *uuid.UUID `json:"userId"`
	ColorID          *uuid.UUID `json:"colorId"`
	ModelID          *uuid.UUID `json:"modelId"`
	TypeID           *uuid.UUID `json:"typeId"`
	DriveTrainTypeID *uuid.UUID `json:"driveTrainTypeId"`
	EngineTypeID     *uuid.UUID `json:"engineTypeId"`
	WeightID         *uuid.UUID `json:"weightID"`
	InsuranceID      *uuid.UUID `json:"insuranceId"`
	CountryID        *uuid.UUID `json:"countryId"`
	Active           *bool      `json:"active"`
}
