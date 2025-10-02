package models

import (
	"bitbucket.org/mya/mya-assistance-core/types"
	"github.com/google/uuid"
)

// craete assistance by user
type CreateAssistance struct {
	UserId      uuid.UUID             `json:"userId"`
	User        UserAssistance        `json:"user" validate:"required"`
	From        OriginAssitence       `json:"from" validate:"required"`
	To          DestinationAssistance `json:"to" validate:"required"`
	Description string                `json:"description" validate:"required"`
	WsUserID    *uuid.UUID            `json:"ws"`
}
type UserAssistance struct {
	VehicleId uuid.UUID `json:"vehicleId" validate:"required"`
	Images    []string  `json:"images" validate:"required"`
}

type DriverStats struct {
	Total  int64 `json:"total"`
	Online int64 `json:"online"`
}

// ***********************************************

type OriginAssitence struct {
	Latitude  float64 `json:"latitude" validate:"required" db:"latitude"`
	Longitude float64 `json:"longitude" validate:"required" db:"longitude"`
	Address   string  `json:"address" validate:"required" db:"address"`
}

type DestinationAssistance struct {
	Latitude    float64 `json:"latitude" validate:"required" db:"latitude"`
	Longitude   float64 `json:"longitude" validate:"required" db:"longitude"`
	Address     string  `json:"address" validate:"required" db:"address"`
	Description string  `json:"description" validate:"required" db:"description"`
}

type DistanceDriverAndPrice struct {
	DistanceToUserMeters float64
	TotalMetersDistance  float64
	// Km                  float64   `db:"km" json:"km"`
	// Meters  float64   `db:"Meters" json:"km"`
	PriceKm float64   `db:"proce_km" json:"priceKm"`
	CoinID  uuid.UUID `db:"coinId" json:"coinId"`
}

type CancelAssistance struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"userId"`
	Description string    `json:"description"`
	RoleKey     uint      `json:"roleKey"`
}

type UpdateStatusAssistance struct {
	StatusId uuid.UUID `json:"statusId"`
}

type ConfirmedAssistance struct {
	ID         uuid.UUID `json:"id" validate:"required"`
	DriverId   uuid.UUID `json:"driverId" validate:"required"` //headers
	TowTruckId uuid.UUID `json:"towTruckId" validate:"required"`
	Latitude   float64   `json:"latitude" validate:"required"`
	Longitude  float64   `json:"longitude" validate:"required"`
	CompanyKey uint      `json:"companyKey" validate:"required"`
}

type ParamsRequestGet struct {
	UserId     *uuid.UUID `json:"userId"`
	DriverId   *uuid.UUID `json:"driverId"`
	TowTruckId *uuid.UUID `json:"towTruckId"`
	CompanyId  *uuid.UUID `json:"companyId"`
	Status     *string    `json:"status"`
}

type CalPriceKm struct {
	Origin      types.Location
	Destination types.Location
	TypeVehicle uuid.UUID
	AccMeters   *float64
}

// func ConvertAssistanceReqPendingToResponse(assistance *Assistance, lang string) *types.AssistancePendingResponse {
// 	return &types.AssistancePendingResponse{
// 		ID:      assistance.ID,
// 		Vehicle: *vehicleModel.ConvertVehicleToVehicleUser(assistance.Vehicle, lang),
// 		From: types.OriginAssitence{
// 			Latitude:  assistance.FromLat,
// 			Longitude: assistance.FromLng,
// 			Address:   assistance.FromAddress,
// 		},
// 		To: types.DestinationAssistance{
// 			Latitude:    assistance.ToLat,
// 			Longitude:   assistance.ToLong,
// 			Address:     assistance.ToAddress,
// 			Description: assistance.ToDescription,
// 		},
// 		Status:    *util.StatusToBase(assistance.Status, lang),
// 		CreatedAt: assistance.CreatedAt,
// 	}
// }
