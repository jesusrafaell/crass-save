package models

import "github.com/google/uuid"

type VehicleMakeAndModelReponse struct {
	MakeID    uuid.UUID `db:"make_id" json:"make_id"`
	ModelID   uuid.UUID `db:"model_id" json:"model_id"`
	MakeName  string    `db:"make_name" json:"make_name"`
	ModelName string    `db:"model_name" json:"model_name"`
}

type BaseWsIds struct {
	VehicleTypeID uuid.UUID `db:"vehicle_type_id"`
	WeightID      uuid.UUID `db:"weight_id"`
	CountryID     uuid.UUID `db:"country_id"`
	MakeID        uuid.UUID `db:"make_id"`

	ColorID          uuid.UUID `db:"color_id"`
	DriveTrainTypeID uuid.UUID `db:"drive_train_type_id"`
	EngineTypeID     uuid.UUID `db:"engine_type_id"`
	InsuranceID      uuid.UUID `db:"insurance_id"`
}

type WSVehicleMakeAndModel struct {
	ModelName string `json:"modelo"`
	MakeName  string `json:"marca"`
}

type WSVehicleMake struct {
	MakeName string `json:"marca"`
}

type WSVehicleModel struct {
	ModelName string `json:"modelo"`
}

type WsUser struct {
	ID                   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id" db:"id"`
	IdentityDocument     string    `gorm:"type:varchar(255);not null" json:"identity_document" db:"identity_document"`
	Mobile               string    `gorm:"type:text;not null" json:"mobile" db:"mobile"`
	Email                string    `gorm:"type:text;unique;not null" json:"email" db:"email"`
	FirstName            string    `gorm:"type:varchar(150);not null" json:"first_name" db:"first_name"`
	LastName             string    `gorm:"type:varchar(150);not null" json:"last_name" db:"last_name"`
	IdentityDocumentPath *string   `gorm:"type:varchar(255)" json:"identity_document_path" db:"identity_document_path"`
	Active               bool      `gorm:"default:true" json:"active" db:"active"`
}
