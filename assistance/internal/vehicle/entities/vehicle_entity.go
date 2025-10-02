package entities

import (
	"github.com/google/uuid"
)

type Vehicle struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	CreatedAt        int64      `json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt        int64      `json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt        *int64     `json:"deletedAt,omitempty" db:"deleted_at"`
	Year             uint       `db:"year" json:"year"`
	LicensePlate     string     `db:"license_plate" json:"licensePlate"`
	PolicyNumber     *string    `db:"policy_number" json:"policyNumber"`
	ImagePath        string     `db:"image_path" json:"imagePath"`
	UserID           uuid.UUID  `db:"user_id" json:"userId"`
	Active           bool       `db:"active" json:"active"`
	MakeID           uuid.UUID  `db:"make_id" json:"makeId"`
	ModelID          uuid.UUID  `db:"model_id" json:"modelId"`
	TypeID           uuid.UUID  `db:"type_id" json:"typeId"`
	WeightID         uuid.UUID  `db:"weight_id" json:"weightId"`
	EngineTypeID     uuid.UUID  `db:"engine_type_id" json:"engineTypeId"`
	ColorID          uuid.UUID  `db:"color_id" json:"colorId"`
	DriveTrainTypeID uuid.UUID  `db:"drive_train_type_id" json:"driveTrainTypeId"`
	InsuranceID      uuid.UUID  `db:"insurance_id" json:"insuranceId"`
	CountryID        uuid.UUID  `db:"country_id" json:"countryId"`
	WsUserID         *uuid.UUID `db:"ws_user_id" json:"wsUserID"`
}
