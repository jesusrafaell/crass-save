package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"crashsaver/parking/types"
	"crashsaver/parking/util"
	"crashsaver/parking/util/customError"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type BookingService struct {
	db         *sqlx.DB
	queries    *queries.BookingQuery
	companySvc *CompanyService
	parkingSvc *ParkingService
	statusSvc  *StatusService
}

var statusOn = []string{"active", "pending", "processing"}

// var statusOff = []string{"pedding", "cancelled", "finished", "completed"}

func NewBookingService(db *sqlx.DB, companySvc *CompanyService, parkingSvc *ParkingService, statusSvc *StatusService) *BookingService {
	return &BookingService{
		db:         db,
		queries:    &queries.BookingQuery{},
		companySvc: companySvc,
		parkingSvc: parkingSvc,
		statusSvc:  statusSvc,
	}
}

func (s *BookingService) List(lang string, filter types.FilterBooking) ([]*data.BookingDataUser, error) {
	var rawBookings []*data.BookingDBWithUser

	var statusFilter []string
	if filter.All == nil || (filter.All != nil && !*filter.All) {
		statusFilter = statusOn
	}

	conditions := util.BuildConditions(lang, filter)

	query := s.queries.GetWithDataUser(lang, statusFilter, conditions)

	err := s.db.Select(&rawBookings, query)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	bookings := util.ConvertBookingsToDataUser(rawBookings)

	return bookings, nil
}

func (s *BookingService) GetListByDriveId(lang string, driveID uuid.UUID, filter types.FilterDriveBooking) ([]*data.BookingData, error) {
	var rawBookings []*data.BookingDB

	//booking by DriveId
	conditions := "WHERE b.id_driver = $1"

	//licensePlate add conditions
	if filter.LicensePlate != nil {
		conditions += " AND b.license_plate = '" + *filter.LicensePlate + "'"
	}

	query := s.queries.GetWithData(lang, statusOn, conditions)

	err := s.db.Select(&rawBookings, query, driveID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	bookings := util.ConvertBookingsToData(rawBookings)
	return bookings, nil
}

func (s *BookingService) Create(lang string, booking *types.BookingCreate) (*types.BookingCreateResponse, error) {
	//valid company and credits
	company, err := s.companySvc.GetByID(booking.CompanyID)
	if err != nil {
		return nil, fmt.Errorf("company not found")
	}

	statusService := NewStatusService(s.db)
	status, err := statusService.GetStatusEN("pending")
	if err != nil {
		return nil, err
	}
	parking, err := s.parkingSvc.GetById("en", booking.ParkingID)
	if err != nil {
		return nil, fmt.Errorf("parking not found")
	}
	//hours
	//get price
	price := float64(0)
	for _, p := range parking.Hours {
		if booking.Hours == p.Hours {
			price = p.Price
		}
	}
	if price == 0 {
		return nil, fmt.Errorf("invalid hours")
	}

	//calcualte endtime
	endTime := util.CalculateEndTime(booking.InitTime, booking.Hours)

	if company.Credits < price {
		return nil, customError.NewCustomError("insufficientCredits")
	}

	var id uuid.UUID
	err = s.db.QueryRow(
		s.queries.Create(),
		booking.InitTime, endTime, booking.Hours,
		booking.LicensePlate, booking.LPContainer, price,
		booking.Description, booking.UserID, booking.CompanyID,
		booking.ParkingID, booking.DriverID, status.ID,
	).Scan(&id)
	if err != nil {
		log.Printf("error create booking %s", err)
		return nil, err
	}

	//restar creditso
	s.companySvc.operationCredits(company.ID, price, false)

	var res types.BookingCreateResponse
	res.ID = id
	//auto asigned
	if booking.DriverID == nil {
		asinsateDriverID, err := s.autoAsignte(id, booking.LicensePlate)
		if err != nil {
			res.AutoAsignate = false
		} else {
			res.DriveID = asinsateDriverID
			res.AutoAsignate = true
		}
	} else {
		go util.NotificationUser(*booking.DriverID, booking.LicensePlate)
	}

	//notificaion parking
	html, sub := util.GetTemplateByParams(&types.TemplateEmailBookingValue{
		ParkingName:           parking.Name,
		LicensePlateValue:     booking.LicensePlate,
		LicenseContainerValue: booking.LPContainer,
		CompanyValue:          company.Name,
		HoursTotalValue:       fmt.Sprintf(`%d`, booking.Hours),
		EntryDateValue:        util.FormatUnixTime(booking.InitTime),
		ExitDateValue:         util.FormatUnixTime(endTime),
	}, parking.Language)

	//notifications emails
	for _, email := range parking.Emails {
		emailData := &types.EmailBody{
			To:      email,
			Subject: sub,
			Text:    "",
			Html:    html,
		}
		go func() {
			log.Printf("RESERVA, company: %s, parking: %s, To: %s", company.Name, parking.Name, emailData.To)
			util.SendEmail(emailData)
		}()
	}
	return &res, nil
}

func (s *BookingService) GetById(lang string, id uuid.UUID) (*data.BookingData, error) {
	var rawBooking data.BookingDB

	//booking by DriveId
	conditions := "WHERE b.id = $1"

	query := s.queries.GetWithData(lang, []string{}, conditions)

	err := s.db.Get(&rawBooking, query, id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	booking := util.ConvertBookingDBToData(&rawBooking)
	return booking, nil
}

func (s *BookingService) Update(id uuid.UUID, update *types.BookingUpdate) error {
	var setClauses []string
	var args []interface{}

	if update.LicensePlate != nil {
		setClauses = append(setClauses, fmt.Sprintf("license_plate = $%d", len(setClauses)+1))
		args = append(args, *update.LicensePlate)
	}
	if update.LPContainer != nil {
		setClauses = append(setClauses, fmt.Sprintf("lp_container = $%d", len(setClauses)+1))
		args = append(args, *update.LPContainer)
	}
	if update.Description != nil {
		setClauses = append(setClauses, fmt.Sprintf("description = $%d", len(setClauses)+1))
		args = append(args, *update.Description)
	}

	//notification
	if update.DriverID != nil {
		setClauses = append(setClauses, fmt.Sprintf("id_driver = $%d", len(setClauses)+1))
		args = append(args, *update.DriverID)
	}

	if update.StatusID != nil {
		setClauses = append(setClauses, fmt.Sprintf("id_status = $%d", len(setClauses)+1))
		args = append(args, *update.StatusID)
	}

	if len(setClauses) == 0 {
		return fmt.Errorf("no fields to update")
	}

	query := fmt.Sprintf(`UPDATE pkl_bookings SET updated_at = %d, %s WHERE id = '%s'`, time.Now().Unix(), strings.Join(setClauses, ", "), id)

	_, err := s.db.Exec(query, args...)
	return err

}

func (s *BookingService) Asignate(b types.BookingAsignate) error {
	// log.Println(licensePlate, driverId)
	query := s.queries.Asignate()
	if b.BookingId != nil {
		query = s.queries.AsignateByBooking()
	}
	_, err := s.db.NamedExec(query, map[string]interface{}{
		"licensePlate": b.LicensePlate,
		"driverId":     b.DriverID,
		"updatedAt":    time.Now().Unix(),
		"bookingId":    *b.BookingId,
	})
	if err != nil {
		log.Printf("error asinsate %v", err)
		return err
	}

	return nil
}

func (s *BookingService) AsignateById(id uuid.UUID, driverId uuid.UUID) error {
	// log.Printf("Booking %s, driver: %s", id, driverId)
	query := s.queries.AsignateById()
	_, err := s.db.NamedExec(query, map[string]interface{}{
		"id":        id,
		"driverId":  driverId,
		"updatedAt": time.Now().Unix(),
	})
	if err != nil {
		log.Printf("error asinsate %v", err)
		return err
	}

	return nil
}

func (s *BookingService) autoAsignte(id uuid.UUID, licensePlate string) (*uuid.UUID, error) {
	truck, err := util.GetTruckByLicensePlate(licensePlate)
	if err != nil {
		log.Printf("Booking: %s, not asigned", id)
		return nil, err
	}
	if truck != nil {
		log.Printf("Truck: %s", &truck.UserID)
		err := s.AsignateById(id, truck.UserID)
		if err != nil {
			log.Printf("error auto asignate: b:%s, driver:%s", id, truck.UserID)
			return nil, fmt.Errorf("error auto asigne dirver: %s", truck.UserID)
		}
		go util.NotificationUser(truck.UserID, licensePlate)
	}
	return &truck.UserID, nil
}

func (s *BookingService) GetCountByDriverId(driveID uuid.UUID, filter types.FilterDriveBooking) (*data.BookingCount, error) {

	var totalBooking data.BookingCount

	query := s.queries.GetCountByDriverId(statusOn)

	log.Println(filter.LicensePlate)
	if filter.LicensePlate != nil {
		query += " AND b.license_plate = '" + *filter.LicensePlate + "'"
	}

	err := s.db.Get(&totalBooking, query, driveID)
	if err != nil {
		log.Println("Error fetching booking count:", err)
		return nil, err
	}

	return &totalBooking, nil
}

func (s *BookingService) CancelById(lang string, id uuid.UUID) *customError.CustomError {
	//get booking
	booking, err := s.GetById("en", id)
	if err != nil {
		log.Printf("Error CancelById(GetById) %v", err)
		return customError.NewCustomError("bookingExpired")
	}
	//valid cancelled (time) /booking is future?
	// EndTime < actualTime
	currentTime := time.Now().Unix()
	if booking.EndTime <= (currentTime - 3600) {
		return customError.NewCustomError("bookingExpired")
	}

	//cancelled
	status, err := s.statusSvc.GetStatusByKey("cancelled")
	if err != nil {
		log.Printf("Error CancelById(GetStatusByKey): %v", err)
		return customError.NewCustomError("errorServer")
	}
	err = s.Update(id, &types.BookingUpdate{
		StatusID: &status.ID,
	})
	if err != nil {
		log.Printf("Error CancelById (Update): %v", err)
		return customError.NewCustomError("errorServer")
	}

	//return money to company
	err = s.companySvc.operationCredits(booking.Company.ID, booking.Price, true)
	if err != nil {
		log.Printf("Error CancelById (operationCredits): %v", err)
	}

	//notificacion send email when now > 1 hora created
	if booking.CreatedAt <= (currentTime - 3600) {
		fmt.Println("no notificar")
		return nil
	}

	//notifications emails parking
	//get parking
	parking, err := s.parkingSvc.GetById("en", booking.Parking.ID)
	if err != nil {
		return customError.NewCustomError("parkingNotFound")
	}

	//notificaion parking
	html, sub := util.GetTemplateCancelledByParams(&types.TemplateEmailBookingValue{
		ParkingName:           parking.Name,
		LicensePlateValue:     booking.LicensePlate,
		LicenseContainerValue: booking.LPContainer,
		CompanyValue:          booking.Company.Name,
		HoursTotalValue:       fmt.Sprintf(`%d`, booking.Hours),
		EntryDateValue:        util.FormatUnixTime(booking.InitTime),
		ExitDateValue:         util.FormatUnixTime(booking.EndTime),
	}, lang)

	for _, email := range parking.Emails {
		emailData := &types.EmailBody{
			To:      email,
			Subject: sub,
			Text:    "",
			Html:    html,
		}
		go func() {
			log.Printf("Reserva Cancelada, company: %s, parking: %s, To: %s", booking.Company.Name, parking.Name, emailData.To)
			util.SendEmail(emailData)
		}()
	}

	return nil
}
