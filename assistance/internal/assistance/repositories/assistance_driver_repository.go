package repositories

import (
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type RequestDriverRepository interface {
	Create(data *models.RequestDriver) error
	GetByRequestID(reqId uuid.UUID) (*[]models.RequestDriver, error)
	GetByDriverID(driverID uuid.UUID) (*[]models.RequestDriver, error)
	GetByDriverIDAndReqID(driverID uuid.UUID, reqID uuid.UUID) (*models.RequestDriver, error)
	DeleteByReqID(reqID uuid.UUID) error
}

type requestDriverRepository struct {
	db *sqlx.DB
}

func NewRequestDriverRepository(db *sqlx.DB) RequestDriverRepository {
	return &requestDriverRepository{db: db}
}

func (r *requestDriverRepository) Create(data *models.RequestDriver) error {
	query := `
		INSERT INTO a_request_drivers (
			driver_id, 
			request_id, 
			created_at, 
			expired_at, 
			driver_to_user, 
			total_distance, 
			price, 
			coin_id
		) VALUES (
			:driver_id, 
			:request_id, 
			:created_at, 
			:expired_at, 
			:driver_to_user, 
			:total_distance, 
			:price, 
			:coin_id
		)`
	_, err := r.db.NamedExec(query, data)
	if err != nil {
		return err
	}
	return nil
}

func (repo *requestDriverRepository) GetByRequestID(reqID uuid.UUID) (*[]models.RequestDriver, error) {
	var list []models.RequestDriver
	query := ` SELECT id, 
			driver_id, 
			request_id, 
			created_at, 
			expired_at, 
			driver_to_user,
			total_distance, 
			price, 
			coin_id
		FROM a_request_drivers WHERE request_id = $1`
	err := repo.db.Select(&list, query, reqID)
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (repo *requestDriverRepository) GetByDriverID(driverID uuid.UUID) (*[]models.RequestDriver, error) {
	var list []models.RequestDriver
	query := `SELECT id, 
			driver_id, 
			request_id, 
			created_at, 
			expired_at, 
			driver_to_user,
			total_distance, 
			price, 
			coin_id
		FROM a_request_drivers WHERE driver_id = $1
	`
	err := repo.db.Select(&list, query, driverID)
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (repo *requestDriverRepository) GetByDriverIDAndReqID(driverID uuid.UUID, reqID uuid.UUID) (*models.RequestDriver, error) {
	var req models.RequestDriver
	query := `SELECT id, 
			driver_id, 
			request_id, 
			created_at, 
			expired_at, 
			driver_to_user,
			total_distance, 
			price, 
			coin_id 
			FROM a_request_drivers WHERE driver_id = $1 AND request_id = $2
		`

	err := repo.db.Get(&req, query, driverID, reqID)
	if err != nil {
		return nil, err
	}
	return &req, nil
}

func (repo *requestDriverRepository) DeleteByReqID(reqID uuid.UUID) error {
	query := `DELETE FROM a_request_drivers WHERE request_id = $1`
	_, err := repo.db.Exec(query, reqID)
	return err
}
