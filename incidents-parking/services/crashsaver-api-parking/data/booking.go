package data

import (
	"github.com/google/uuid"
)

type BParking struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Country   string    `json:"country"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
}

type BCompany struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
}

type BDriver struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	Email  string    `json:"email"`
	Mobile string    `json:"mobile"`
}

type BStatus struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Key  string    `json:"key"`
	Type *string   `json:"type,omitempty"`
}

type BService struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Key  int       `json:"key"`
}

type BookingDB struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	LicensePlate string     `db:"licensePlate" json:"licensePlate"`
	LPContainer  string     `db:"lpContainer" json:"lpContainer"`
	Description  string     `db:"description" json:"description"`
	InitTime     int64      `db:"initTime" json:"initTime"`
	EndTime      int64      `db:"endTime" json:"endTime"`
	Hours        int32      `db:"hours" json:"hours"`
	Price        float64    `db:"price" json:"price"`
	CreatedAt    int64      `db:"createdAt" json:"createdAt"`
	UpdatedAt    int64      `db:"updatedAt" json:"updatedAt"`
	UserID       uuid.UUID  `db:"userId" json:"userId"`
	DriverID     *uuid.UUID `db:"driverId" json:"driverId"` // Nullable
	ParkingID    uuid.UUID  `db:"parkingId" json:"parkingId"`
	CompanyID    uuid.UUID  `db:"companyId" json:"companyId"`
	StatusID     uuid.UUID  `db:"statusId" json:"statusId"`
	//FK
	Parking  []byte `db:"parking"`
	Company  []byte `db:"company"`
	Status   []byte `db:"status"`
	Services []byte `db:"services"`
}

type BookingData struct {
	ID           uuid.UUID  `json:"id"`
	LicensePlate string     `json:"licensePlate"`
	LPContainer  string     `json:"lpContainer"`
	Description  string     `json:"description"`
	InitTime     int64      `json:"initTime"`
	EndTime      int64      `json:"endTime"`
	Hours        int32      `json:"hours"`
	Price        float64    `json:"price"`
	UserID       uuid.UUID  `json:"userId"`
	DriverID     *uuid.UUID `json:"driverId"`
	Parking      BParking   `json:"parking"`
	Company      BCompany   `json:"company"`
	Status       BStatus    `json:"status"`
	Services     []BService `json:"services"`
	CreatedAt    int64      `json:"createdAt"`
	UpdatedAt    int64      `json:"updatedAt"`
}

type BookingCount struct {
	Length int32 `json:"length" db:"length"`
}

type BookingDBWithUser struct {
	ID             uuid.UUID  `db:"id" json:"id"`
	LicensePlate   string     `db:"licensePlate" json:"licensePlate"`
	LPContainer    string     `db:"lpContainer" json:"lpContainer"`
	Description    string     `db:"description" json:"description"`
	InitTime       int64      `db:"initTime" json:"initTime"`
	EndTime        int64      `db:"endTime" json:"endTime"`
	Hours          uint       `db:"hours" json:"hours"`
	Price          float64    `db:"price" json:"price"`
	UserID         *uuid.UUID `db:"userId" json:"userId"`     // Nullable
	DriverID       *uuid.UUID `db:"driverId" json:"driverId"` // Nullable
	FullNameDriver string     `db:"fullNameDriver" json:"fullNameDriver"`
	ParkingID      uuid.UUID  `db:"parkingId" json:"parkingId"`
	Driver         []byte     `db:"driver"`
	Parking        []byte     `db:"parking"`
	Company        []byte     `db:"company"`
	Status         []byte     `db:"status"`
	Services       []byte     `db:"services"`
	CreatedAt      int64      `db:"createdAt" json:"createdAt"`
	UpdatedAt      int64      `db:"updatedAt" json:"updatedAt"`
}

type BookingDataUser struct {
	ID           uuid.UUID  `json:"id"`
	LicensePlate string     `json:"licensePlate"`
	LPContainer  string     `json:"lpContainer"`
	Description  string     `json:"description"`
	InitTime     int64      `json:"initTime"`
	EndTime      int64      `json:"endTime"`
	Hours        uint       `json:"hours"`
	Price        float64    `json:"price"`
	UserID       *uuid.UUID `json:"userId"`
	DriverID     string     `json:"driverId"`
	Driver       *BDriver   `json:"driver"`
	Parking      BParking   `json:"parking"`
	Services     []BService `json:"services"` //from parking
	Company      BCompany   `json:"company"`
	Status       BStatus    `json:"status"`
	CreatedAt    int64      `json:"createdAt"`
	UpdatedAt    int64      `json:"updatedAt"`
}
