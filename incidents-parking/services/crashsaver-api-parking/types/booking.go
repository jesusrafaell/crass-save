package types

import "github.com/google/uuid"

type FilterBooking struct {
	LicensePlate *string `json:"licensePlate,omitempty"`
	LPContainer  *string `json:"lpContainer,omitempty"`
	UserID       *string `json:"userId,omitempty"`
	ParkingID    *string `json:"parkingId,omitempty"`
	CompanyID    *string `json:"companyId,omitempty"`
	DriverID     *string `json:"driverId,omitempty"`
	All          *bool   `json:"all,omitempty"`
}

type FilterDriveBooking struct {
	LicensePlate *string `json:"licensePlate,omitempty"`
	All          *bool   `json:"all,omitempty"`
}

type BookingCreate struct {
	LicensePlate string     `json:"licensePlate"`
	LPContainer  string     `json:"lpContainer"`
	Description  string     `json:"description"`
	UserID       uuid.UUID  `json:"userId"`
	DriverID     *uuid.UUID `json:"driverId,omitempty"` // Nullable
	ParkingID    uuid.UUID  `json:"parkingId"`
	CompanyID    uuid.UUID  `json:"companyId"`
	InitTime     int64      `json:"initTime"`
	//new
	Hours uint `json:"hours"`
}

type TemplateEmailBookingValue struct {
	ParkingName           string
	LicensePlateValue     string
	LicenseContainerValue string
	EntryDateValue        string
	ExitDateValue         string
	HoursTotalValue       string
	CompanyValue          string
}

type TemplateEmailBookingTitle struct {
	Title                 string
	Description           string
	LicensePlateTitle     string
	LicenseContainerTitle string
	EntryDateTitle        string
	ExitDateTitle         string
	HoursEntryDateTitle   string
	HoursExitDateTitle    string
	HoursTotalTitle       string
	CompanyTitle          string
}

type BookingUpdate struct {
	LicensePlate *string    `json:"licensePlate"`
	LPContainer  *string    `json:"lpContainer"`
	Description  *string    `json:"description"`
	DriverID     *uuid.UUID `json:"driverId,omitempty"` // Nullable
	StatusID     *uuid.UUID `json:"statusId"`
}

type CancelBooking struct {
	BookingID uuid.UUID `json:"bookingId" validate:"required"`
}
type BookingAsignate struct {
	DriverID     uuid.UUID  `json:"driverId"`
	LicensePlate string     `json:"licensePlate"`
	BookingId    *uuid.UUID `json:"bookingId"`
}

type BookingCreateResponse struct {
	ID           uuid.UUID  `json:"id"`
	DriveID      *uuid.UUID `json:"driverId,omitempty"`
	AutoAsignate bool       `json:"autoAsignate"`
}

type EmailBody struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Text    string `json:"text"`
	Html    string `json:"html"`
}
