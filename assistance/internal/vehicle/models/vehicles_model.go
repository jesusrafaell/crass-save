package models

import (
	"github.com/google/uuid"
)

type AddVehicle struct {
	Year         uint      `json:"year" validate:"required"`
	LicensePlate string    `json:"licensePlate" validate:"required"`
	PolicyNumber *string   `json:"policyNumber"`
	ImagePath    string    `json:"imagePath" validate:"required"`
	UserID       uuid.UUID `json:"userId" validate:"required"`
	//
	ColorID          uuid.UUID  `json:"colorId" validate:"required"`
	ModelID          uuid.UUID  `json:"modelId" validate:"required"`
	TypeID           uuid.UUID  `json:"typeId" validate:"required"`
	DriveTrainTypeID uuid.UUID  `json:"driveTrainTypeId" validate:"required"`
	EngineTypeID     uuid.UUID  `json:"engineTypeId" validate:"required"`
	WeightID         uuid.UUID  `json:"weightID" validate:"required"`
	InsuranceID      *uuid.UUID `json:"insuranceId"`
	CountryID        uuid.UUID  `json:"countryId" validate:"required"`
}

// package dtos

// import (
// 	"github.com/invopop/validation"
// )

// type CreateUserRequest struct {
// 	FullName    string `json:"fullname"`
// 	PhoneNumber string `json:"phone_number"`
// 	Email       string `json:"email"`
// 	Password    string `json:"password"`
// }

// type CreateUserResponse struct {
// 	UserID    int64  `json:"user_id"`
// 	Token     string `json:"token"`
// 	ExpiredAt int64  `json:"expired_at"`
// }

// func (cup CreateUserRequest) Validate() error {
// 	return validation.ValidateStruct(&cup,
// 		validation.Field(&cup.FullName, validation.Required, validation.Length(0, 50)),
// 		validation.Field(&cup.PhoneNumber, validation.Required, validation.Length(0, 13)),
// 		validation.Field(&cup.Email, validation.Required),
// 		validation.Field(&cup.Password, validation.Required),
// 	)
// }
