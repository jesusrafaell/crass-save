package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PkSVCService struct {
	db      *sqlx.DB
	queries *queries.PKServicesQuery
}

func NewPkSVCService(db *sqlx.DB) *PkSVCService {
	return &PkSVCService{
		db:      db,
		queries: &queries.PKServicesQuery{},
	}
}

func (ps *PkSVCService) GetByParkingID(lang string, parkingId uuid.UUID) ([]*data.PkService, error) {
	var pkServices []*data.PkService
	err := ps.db.Select(&pkServices, ps.queries.GetServicesByParking(lang), parkingId)
	if err != nil {
		return nil, err
	}

	return pkServices, nil
}

func (ps *PkSVCService) GetAll(lang string) ([]*data.Services, error) {
	var services []*data.Services
	err := ps.db.Select(&services, ps.queries.GetAll(lang))
	if err != nil {
		return nil, err
	}

	return services, nil
}

func (ps *PkSVCService) AddServiceToParking(parkingId uuid.UUID, statusActiveId uuid.UUID, serviceId uuid.UUID) error {
	query := `
		INSERT INTO public.pkl_parkings_services(
            id_parking, id_status, price, id_service
        ) VALUES ($1, $2, 0, $3)
	`
	_, err := ps.db.Exec(query, parkingId, statusActiveId, serviceId)
	if err != nil {
		log.Printf("Error services, AddServiceToParking: %v", err)
		return fmt.Errorf("error services, AddServiceToParking: %v", err)
	}

	log.Printf("Added Service: %s, in Parking: %s", serviceId, parkingId)
	return nil
}
