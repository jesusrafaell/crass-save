package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"crashsaver/parking/types"
	"crashsaver/parking/util/customError"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type ParkingService struct {
	db           *sqlx.DB
	queries      *queries.ParkingQuery
	pkSVCService *PkSVCService
	statusActive *data.BStatus
}

const emailDefault = `administracion@crashsaverapp.com`

func NewParkingService(db *sqlx.DB, pkSVCService *PkSVCService, statusService *StatusService) *ParkingService {
	statusActive, err := statusService.GetStatusByKey("active")
	if err != nil {
		log.Fatalf("Error NewParkingService, getStatus %v", err)
	}
	return &ParkingService{
		db:           db,
		queries:      &queries.ParkingQuery{},
		pkSVCService: pkSVCService,
		statusActive: statusActive,
	}
}

func (ps *ParkingService) ListParking(lang string, all bool) ([]*data.Parking, error) {
	var parkings []*data.Parking
	clause := fmt.Sprintf(`WHERE p.id_status = '%s'`, ps.statusActive.ID)
	if all {
		clause = ""
	}
	query := ps.queries.GetDataParkings(lang, clause)
	err := ps.db.Select(&parkings, query)
	if err != nil {
		log.Printf("Error ListParking: %v", err)
		return nil, err
	}

	return parkings, nil
}

func (ps *ParkingService) GetById(lang string, id uuid.UUID) (*data.Parking, error) {
	var parking data.Parking
	err := ps.db.Get(&parking, ps.queries.GetDataParkings(lang, "WHERE p.id = $1"), id)
	if err != nil {
		return nil, fmt.Errorf("parking not found")
	}
	return &parking, nil
}

func (ps *ParkingService) GetPriceByParkingAndHours(parkingId uuid.UUID, hours uint) (*float64, error) {
	var price float64
	query := "SELECT price FROM pkl_parkings_price_hours WHERE parking_id = $1 and hours = $2 LIMIT 1"
	err := ps.db.Select(&price, query, parkingId, hours)
	if err != nil {
		return nil, err
	}

	log.Println("PRICE:", price)
	return &price, nil
}

func (ps *ParkingService) Create(p types.CreateParking) *customError.CustomError {
	//validate data

	//create parking
	var id uuid.UUID
	err := ps.db.QueryRow(
		ps.queries.Create(),
		p.Name, p.Country, p.Address, p.AvailableSpace, ps.statusActive.ID, pq.Array(append(p.Emails, emailDefault)),
		p.Latitude, p.Longitude, p.Language,
	).Scan(&id)
	if err != nil {
		log.Printf("error create parking %s", err)
		return customError.NewCustomError("errorServer")
	}
	log.Printf("Parking created: %s", id)

	//add services
	log.Printf("Services Total: %d", len(p.ServicesIds))
	for _, s := range p.ServicesIds {
		errService := ps.pkSVCService.AddServiceToParking(id, ps.statusActive.ID, s)
		if errService != nil {
			return customError.NewCustomError("errorServer")
		}
	}

	//add hours
	log.Printf("Hours Total: %d", len(p.Hours))

	queryHours := `
		INSERT INTO public.pkl_parkings_price_hours(
			parking_id, hours, price
		) VALUES ($1, $2, $3)
	`
	for _, h := range p.Hours {
		_, err := ps.db.Exec(queryHours, id, h.Hours, h.Price)
		if err != nil {
			log.Printf("Services parking, Create, add Hours %v", err)
			return customError.NewCustomError("errorServer")
		}

		log.Printf("Added Hours: %d, price: %f, in Parking: %s", h.Hours, h.Price, id)
	}
	//res
	return nil
}
