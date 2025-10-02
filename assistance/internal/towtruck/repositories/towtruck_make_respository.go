package repositories

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TowTruckMakesRepository interface {
	GetByID(id uuid.UUID) (*models.TowTruckMake, error)
	GetByName(name string) (*models.TowTruckMake, error)
	Create(data *entities.TowTruckMake) error
	GetAll() (*[]models.TowTruckMake, error)
	Update(data *entities.TowTruckMake) error
	Delete(id uuid.UUID) error
}

type towTruckMakesRepository struct {
	db *sqlx.DB
}

func NewTowTruckMakeRepository(db *sqlx.DB) TowTruckMakesRepository {
	return &towTruckMakesRepository{db}
}

func (r *towTruckMakesRepository) GetByID(id uuid.UUID) (*models.TowTruckMake, error) {
	var data models.TowTruckMake
	query := `SELECT id, name FROM a_tow_trucks_makes WHERE id = $1`
	err := r.db.Get(&data, query, id)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *towTruckMakesRepository) GetByName(name string) (*models.TowTruckMake, error) {
	var data models.TowTruckMake
	query := `SELECT id, name FROM a_tow_trucks_makes WHERE name = $1`
	err := r.db.Get(&data, query, name)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *towTruckMakesRepository) Create(data *entities.TowTruckMake) error {
	query := `INSERT INTO a_tow_trucks_makes (name) VALUES (:name)`
	_, err := r.db.NamedExec(query, data)
	return err
}

func (r *towTruckMakesRepository) GetAll() (*[]models.TowTruckMake, error) {
	var list []models.TowTruckMake
	query := `SELECT id, name FROM a_tow_trucks_makes ORDER BY name ASC`
	err := r.db.Select(&list, query)
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (r *towTruckMakesRepository) Update(data *entities.TowTruckMake) error {
	query := `UPDATE a_tow_trucks_makes SET name = :name WHERE id = :id`
	_, err := r.db.NamedExec(query, data)
	return err
}

func (r *towTruckMakesRepository) Delete(id uuid.UUID) error {
	query := `DELETE FROM a_tow_trucks_makes WHERE id = $1`
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
