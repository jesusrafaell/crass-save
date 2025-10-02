package util

import (
	"crashsaver/parking/data"
	"encoding/json"
	"log"
)

func ConvertBookingsToDataUser(bookings []*data.BookingDBWithUser) []*data.BookingDataUser {
	bookingsData := make([]*data.BookingDataUser, len(bookings))
	for i, rb := range bookings {
		bookingsData[i] = convertBookingDBToDataUser(rb)
	}

	return bookingsData
}

func convertBookingDBToDataUser(b *data.BookingDBWithUser) *data.BookingDataUser {
	var parking data.BParking
	var company data.BCompany
	var driver *data.BDriver
	var status data.BStatus
	var services []data.BService

	if err := json.Unmarshal(b.Parking, &parking); err != nil {
		log.Println("Error unmarshalling parking", err)
	}
	if b.Driver != nil {
		if err := json.Unmarshal(b.Driver, &driver); err != nil {
			log.Println("Error unmarshalling driver", err)
		}
	}
	if err := json.Unmarshal(b.Company, &company); err != nil {
		log.Println("Error unmarshalling company", err)
	}
	if err := json.Unmarshal(b.Status, &status); err != nil {
		log.Println("Error unmarshalling status", err)
	}
	if err := json.Unmarshal(b.Services, &services); err != nil {
		log.Println("Error unmarshalling services", err)
	}

	return &data.BookingDataUser{
		ID:           b.ID,
		LicensePlate: b.LicensePlate,
		LPContainer:  b.LPContainer,
		Description:  b.Description,
		InitTime:     b.InitTime,
		EndTime:      b.EndTime,
		Hours:        b.Hours,
		Price:        b.Price,
		UserID:       b.UserID,
		DriverID:     b.FullNameDriver,
		Driver:       driver,
		Parking:      parking,
		Company:      company,
		Status:       status,
		Services:     services,
		CreatedAt:    b.CreatedAt,
		UpdatedAt:    b.UpdatedAt,
	}
}
