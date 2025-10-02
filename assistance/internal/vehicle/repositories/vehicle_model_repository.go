package repositories

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ModelRepository interface {
	Create(data *models.VehicleModel, makeID uuid.UUID) error
	GetAll() (*[]models.VehicleModel, error)
	GetByMakeID(makeID uuid.UUID) (*[]models.VehicleModel, error)
	Update(data *models.VehicleModel) error
	Delete(id uuid.UUID) error
	GetByMakeName(makeName string) (*[]models.VehicleModel, error)
}

type modelRepository struct {
	db *sqlx.DB
}

func NewModelRepository(db *sqlx.DB) ModelRepository {
	return &modelRepository{db: db}
}

func (r *modelRepository) Create(data *models.VehicleModel, makeID uuid.UUID) error {
	var existingModel models.VehicleModel
	err := r.db.Get(&existingModel, "SELECT id, name FROM a_vehicles_models WHERE name = $1", data.Name)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return err
		} else {
			return err
		}
	}

	var makeModel entities.MakeModel
	err = r.db.Get(&makeModel, "SELECT make_id, model_id FROM a_vehicles_makes_models WHERE make_id = $1 AND model_id = $2", makeID, data.ID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Crear la relación Make-Model en a_vehicles_makes_models
			_, err := r.db.Exec("INSERT INTO a_vehicles_makes_models (make_id, model_id) VALUES ($1, $2)", makeID, data.ID)
			return err
		} else {
			return err
		}
	}

	return fmt.Errorf("Error:%v", "Model & Make relationship already exists")
}

func (r *modelRepository) GetAll() (*[]models.VehicleModel, error) {
	var models []models.VehicleModel
	err := r.db.Select(&models, "SELECT id, name FROM a_vehicles_models ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	return &models, nil
}

func (r *modelRepository) GetByMakeID(makeID uuid.UUID) (*[]models.VehicleModel, error) {
	var models []models.VehicleModel

	sql := `SELECT m.id, m.name FROM a_vehicles_makes_models mxm
            JOIN a_vehicles_models m ON m.id = mxm.model_id
            WHERE mxm.make_id = $1
			ORDER BY m.name ASC`

	err := r.db.Select(&models, sql, makeID)
	if err != nil {
		return nil, err
	}

	return &models, nil
}

func (r *modelRepository) Update(data *models.VehicleModel) error {
	_, err := r.db.NamedExec("UPDATE a_vehicles_models SET name = :name WHERE id = :id", data)
	return err
}

func (r *modelRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_vehicles_models WHERE id = $1", id)
	return err
}

func (r *modelRepository) GetByMakeName(makeName string) (*[]models.VehicleModel, error) {
	var models []models.VehicleModel

	sql := `
		SELECT DISTINCT mo.name, mo.id
		FROM public.a_vehicles_makes_models mm
		JOIN public.a_vehicles_makes ma ON mm.make_id = ma.id
		JOIN public.a_vehicles_models mo ON mm.model_id = mo.id
		WHERE similarity(ma.name, $1) > 0.3
		ORDER BY mo.name ASC
	`

	err := r.db.Select(&models, sql, "%"+makeName+"%")
	if err != nil {
		log.Println("Error", err)
		return nil, fmt.Errorf("error vehicle_model_repository.GetByMakeName %v", err)
	}

	return &models, nil
}
