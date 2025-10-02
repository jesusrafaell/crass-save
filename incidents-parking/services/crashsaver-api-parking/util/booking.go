package util

import (
	"crashsaver/parking/data"
	"crashsaver/parking/types"
	"encoding/json"
	"log"
	"strings"
)

func ConvertBookingsToData(bookings []*data.BookingDB) []*data.BookingData {
	bookingsData := make([]*data.BookingData, len(bookings))
	for i, rb := range bookings {
		bookingsData[i] = ConvertBookingDBToData(rb)
	}

	return bookingsData
}

func ConvertBookingDBToData(b *data.BookingDB) *data.BookingData {
	var parking data.BParking
	var company data.BCompany
	var status data.BStatus
	var services []data.BService

	if err := json.Unmarshal(b.Parking, &parking); err != nil {
		log.Println("Error unmarshalling parking", err)
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

	return &data.BookingData{
		ID:           b.ID,
		LicensePlate: b.LicensePlate,
		LPContainer:  b.LPContainer,
		Description:  b.Description,
		InitTime:     b.InitTime,
		EndTime:      b.EndTime,
		Hours:        b.Hours,
		Price:        b.Price,
		UserID:       b.UserID,
		DriverID:     b.DriverID,
		Parking:      parking,
		Company:      company,
		Status:       status,
		Services:     services,
		CreatedAt:    b.CreatedAt,
		UpdatedAt:    b.UpdatedAt,
	}
}

func BuildConditions(lang string, filter types.FilterBooking) string {
	var conditions []string

	if filter.LicensePlate != nil {
		conditions = append(conditions, "b.license_plate = '"+*filter.LicensePlate+"'")
	}

	if filter.LPContainer != nil {
		conditions = append(conditions, "b.lp_container = '"+*filter.LPContainer+"'")
	}

	if filter.UserID != nil {
		conditions = append(conditions, "b.id_user = '"+*filter.UserID+"'")
	}

	if filter.ParkingID != nil {
		conditions = append(conditions, "b.id_parking = '"+*filter.ParkingID+"'")
	}

	if filter.DriverID != nil {
		conditions = append(conditions, "b.id_driver = '"+*filter.DriverID+"'")
	}

	if filter.CompanyID != nil {
		conditions = append(conditions, "b.id_company = '"+*filter.CompanyID+"'")
	}

	conditionsStr := ""
	if len(conditions) > 0 {
		conditionsStr = "WHERE " + strings.Join(conditions, " AND ")
	}

	return conditionsStr
}
