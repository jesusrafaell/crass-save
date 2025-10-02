package repositories

import (
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TypeRepository interface {
	Create(data *entities.VehicleType) error
	GetByID(lang string, id uuid.UUID) (*models.VehicleType, error)
	Update(data *entities.VehicleType) error
	Delete(id uuid.UUID) error
	//
	GetAll(lang string) (*[]models.VehicleType, error)
	GetAllByWS(lang string) (*[]models.VehicleType, error)
	GetByKey(lang string, key uint) (*models.VehicleType, error)
}

type typeRepository struct {
	db *sqlx.DB
}

func NewTypeRepository(db *sqlx.DB) TypeRepository {
	return &typeRepository{db: db}
}

func (r *typeRepository) GetQuery(lang string) string {
	return fmt.Sprintf("SELECT id, key, %s as name FROM a_vehicles_types ", lang)
}

func (r *typeRepository) GetByID(lang string, id uuid.UUID) (*models.VehicleType, error) {
	var vType models.VehicleType

	query := r.GetQuery(lang) + "WHERE id = $1"

	err := r.db.Get(&vType, query, id)
	if err != nil {
		return nil, err
	}
	return &vType, nil
}

func (r *typeRepository) Create(data *entities.VehicleType) error {
	_, err := r.db.NamedExec(`INSERT INTO a_vehicles_types (key, en, es) VALUES (:key, :en, :es)`, data)
	return err
}

func (r *typeRepository) GetAll(lang string) (*[]models.VehicleType, error) {
	var list []models.VehicleType
	query := r.GetQuery(lang) + "ORDER BY KEY ASC"

	err := r.db.Select(&list, query)
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (r *typeRepository) Update(data *entities.VehicleType) error {
	_, err := r.db.NamedExec(`UPDATE a_vehicles_types SET key = :key, en = :en, es = :es WHERE id = :id`, data)
	return err
}

func (r *typeRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_vehicles_types WHERE id = $1", id)
	return err
}

func (r *typeRepository) GetAllByWS(lang string) (*[]models.VehicleType, error) {
	var res []models.VehicleType

	query := fmt.Sprintf("SELECT id, key, %s as name FROM a_vehicles_types WHERE ws = true ORDER BY key ASC", lang)

	err := r.db.Select(&res, query)
	if err != nil {
		return nil, err
	}

	return &res, nil
}

func (r *typeRepository) GetByKey(lang string, key uint) (*models.VehicleType, error) {
	var vType models.VehicleType
	query := fmt.Sprintf("SELECT id, key, %s as name FROM a_vehicles_types WHERE key = $1", lang)
	err := r.db.Get(&vType, query, key)
	if err != nil {
		return nil, err
	}
	return &vType, nil
}
