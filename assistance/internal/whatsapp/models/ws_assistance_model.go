package models

import "github.com/google/uuid"

type CreateWSAssistance struct {
	//user
	DocIdent      string `json:"docIdent" validate:"required"` //primary
	FullName      string `json:"fullName" validate:"required"`
	DoctIdentPath string `json:"doctIdentPath" validate:"required"`
	Mobile        string `json:"mobile" validate:"required"`
	Email         string `json:"email" validate:"required"` //no

	//vehicle
	LicensePlate string    `json:"licensePlate" validate:"required"`
	Year         uint      `json:"year" validate:"required"`
	ModelID      uuid.UUID `json:"modelId" validate:"required"`
	TypeKey      uint      `json:"typeKey" validate:"required"`
	// VehiclePath  string    `json:"vehiclePath" validate:"required"`
	WeightKey uint `json:"weightKey" validate:"required"`

	// AssistencePhoto string  `json:"assistencePhoto" validate:"required"`
	OriginLat      float64 `json:"originLat" validate:"required"`
	OriginLng      float64 `json:"originLng" validate:"required"`
	DestinationLat float64 `json:"destinationLat" validate:"required"`
	DestinationLng float64 `json:"destinationLng" validate:"required"`
	Description    string  `json:"description" validate:"required"`

	CountryKey uint `json:"countryKey" validate:"required"` //default
}
type WsUserBotize struct {
	DocIdent      string `json:"docIdent" validate:"required"` //primary
	FullName      string `json:"fullName" validate:"required"`
	DoctIdentPath string `json:"doctIdentPath"`
	Mobile        string `json:"mobile" validate:"required"`
	Email         string `json:"email" validate:"required"`      //no
	CountryKey    uint   `json:"countryKey" validate:"required"` //default
}

type WSVehicleBotize struct {
	WsUserID     uuid.UUID
	LicensePlate string    `json:"licensePlate" validate:"required"`
	Year         uint      `json:"year" validate:"required"`
	ModelID      uuid.UUID `json:"modelId" validate:"required"`
	TypeKey      uint      `json:"typeKey" validate:"required"`
	WeightKey    uint      `json:"weightKey" validate:"required"`
	CountryKey   uint      `json:"countryKey" validate:"required"` //default
	// VehiclePath  string    `json:"vehiclePath" validate:"required"`
}

type GetByMobile struct {
	Mobile string     `json:"mobile" `
	ReqID  *uuid.UUID `json:"reqId" `
}

type ConfirmedRequest struct {
	Mobile string    `json:"mobile" `
	ReqID  uuid.UUID `json:"req_id" `
}

type CancelAssistanceByWS struct {
	ID uuid.UUID `json:"id"`
	// UserID      uuid.UUID `json:"userId"` mobile?
	Description string `json:"description"`
}

// type Create struct {
// 	Name        string  `json:"fullname"`
// 	DNI         string  `json:"dni"`
// 	UrlDni      string  `json:"url_dni"`
// 	Placa       string  `json:"placa"`
// 	Modelo      string  `json:"modelo"`
// 	Marca       string  `json:"marca"`
// 	UrlVehiculo string  `json:"url_vehiculo"`
// 	Numero      string  `json:"from_number"`
// 	Latitude    float64 `json:"latitude"`
// 	Longitude   float64 `json:"longitude"`
// }

type AssistanceWS struct {
	AssistanceID     string `db:"assistance_id"`
	StatusID         string `db:"status_id"`
	StatusKey        string `db:"status_key"`
	WsUserID         string `db:"ws_id"`
	Mobile           string `db:"ws_mobile"`
	IdentityDocument string `db:"ws_identity_document"`
	Email            string `db:"ws_email"`
	Active           bool   `db:"ws_active"`
}
