package repositories

import (
	"fmt"
	"log"
	"strings"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type MakeRepository interface {
	GetByID(id uuid.UUID) (*models.VehicleMake, error)
	GetByName(name string) (*models.VehicleMake, error)
	Create(make *entities.VehicleMake) error
	GetAll() (*[]models.VehicleMake, error)
	Update(make *models.VehicleMake) error
	Delete(id uuid.UUID) error
	GetByModelID(modelID uuid.UUID) (*models.VehicleMake, error)
	GetVehicleMakeAndModelByNames(vehicleMake, vehicleModel *string) (*models.VehicleMakeAndModel, error)
}

type makeRepository struct {
	db *sqlx.DB
}

func NewMakeRepository(db *sqlx.DB) MakeRepository {
	return &makeRepository{db: db}
}

func (r *makeRepository) GetByID(id uuid.UUID) (*models.VehicleMake, error) {
	var make models.VehicleMake
	err := r.db.Get(&make, "SELECT id, name FROM a_vehicles_makes WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &make, nil
}

func (r *makeRepository) GetByName(name string) (*models.VehicleMake, error) {
	var make models.VehicleMake
	err := r.db.Get(&make, "SELECT id, name FROM a_vehicles_makes WHERE name = $1", name)
	if err != nil {
		return nil, err
	}
	return &make, nil
}

func (r *makeRepository) Create(make *entities.VehicleMake) error {
	_, err := r.db.NamedExec("INSERT INTO a_vehicles_makes (name) VALUES (:name)", make)
	return err
}

func (r *makeRepository) GetAll() (*[]models.VehicleMake, error) {
	var list []models.VehicleMake
	err := r.db.Select(&list, "SELECT id, name FROM a_vehicles_makes ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (r *makeRepository) Update(make *models.VehicleMake) error {
	_, err := r.db.NamedExec("UPDATE a_vehicles_makes SET name = :name WHERE id = :id", make)
	return err
}

func (r *makeRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_vehicles_makes WHERE id = $1", id)
	return err
}

func (r *makeRepository) GetByModelID(modelID uuid.UUID) (*models.VehicleMake, error) {
	var make models.VehicleMake
	sql := `SELECT 
				m.id, 
				m.name 
			FROM a_vehicles_makes_models mxm
            JOIN a_vehicles_makes m ON m.id = mxm.make_id
            WHERE mxm.model_id = $1
			LIMIT 1`

	err := r.db.Get(&make, sql, modelID)
	if err != nil {
		log.Printf("Error vehiclesMakesRepository.GetByModelID %v", err)
		return nil, err
	}
	return &make, nil
}

func (r *makeRepository) GetVehicleMakeAndModelByNames(vehicleMake, vehicleModel *string) (*models.VehicleMakeAndModel, error) {
	var vehicleMakeAndModels models.VehicleMakeAndModel

	// Base SQL
	sql := `
		SELECT 
			mm.make_id AS "make.id", 
			ma.name AS "make.name", 
			mm.model_id AS "model.id", 
			mo.name AS "model.name"
		FROM public.a_vehicles_makes_models mm 
		JOIN public.a_vehicles_makes ma ON mm.make_id = ma.id 
		JOIN public.a_vehicles_models mo ON mm.model_id = mo.id 
	`

	var conditions []string
	var args []interface{}

	// Add conditions based on provided arguments
	if vehicleMake != nil && *vehicleMake != "" {
		conditions = append(conditions, "similarity(ma.name, $1) > 0.3")
		// conditions = append(conditions, "(ma.name ILIKE '%' || $1 || '%' OR ma.name ILIKE $1 || '%' OR ma.name ILIKE '%' || $1 || '%')")
		args = append(args, *vehicleMake)
	}
	if vehicleModel != nil && *vehicleModel != "" {
		conditions = append(conditions, "similarity(mo.name, $2) > 0.3")
		// conditions = append(conditions, "(mo.name ILIKE '%' || $2 || '%' OR mo.name ILIKE $2 || '%' OR mo.name ILIKE '%' || $2 || '%')")
		args = append(args, *vehicleModel)
	}

	// If conditions exist
	if len(conditions) > 0 {
		sql += " WHERE " + strings.Join(conditions, " AND ")
	}

	err := r.db.Get(&vehicleMakeAndModels, sql, args...)
	if err != nil {
		fmt.Println("Error:", err)
		return nil, err
	}

	return &vehicleMakeAndModels, nil
}
