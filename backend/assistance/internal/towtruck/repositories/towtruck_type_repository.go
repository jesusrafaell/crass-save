package repositories

import (
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TowTruckTypesRepository interface {
	GetByID(lang string, id uuid.UUID) (*models.TowTruckType, error)
	GetByNames(en, es string) (*models.TowTruckType, error)
	Create(data *entities.TowTruckType) error
	GetAll(lang string) (*[]models.TowTruckType, error)
	Update(data *entities.TowTruckType) error
	Delete(id uuid.UUID) error
}

type towTruckTypesRepository struct {
	db *sqlx.DB
}

func NewTowTruckTypesRepository(db *sqlx.DB) TowTruckTypesRepository {
	return &towTruckTypesRepository{db: db}
}

func (r *towTruckTypesRepository) GetByID(lang string, id uuid.UUID) (*models.TowTruckType, error) {
	var towTruckType models.TowTruckType
	query := fmt.Sprintf(`SELECT id, %s as name FROM a_tow_trucks_types WHERE id = $1`, lang)
	err := r.db.Get(&towTruckType, query, id)
	if err != nil {
		return nil, err
	}
	return &towTruckType, nil
}

func (r *towTruckTypesRepository) GetByNames(en, es string) (*models.TowTruckType, error) {
	var towTruckType models.TowTruckType
	query := `SELECT id, en, es FROM a_tow_trucks_types WHERE en = $1 OR es = $2`
	err := r.db.Get(&towTruckType, query, en, es)
	if err != nil {
		return nil, err
	}
	return &towTruckType, nil
}

func (r *towTruckTypesRepository) Create(towTruckType *entities.TowTruckType) error {
	query := `
		INSERT INTO a_tow_trucks_types ( en, es) 
		VALUES (:en, :es)`
	_, err := r.db.NamedExec(query, towTruckType)
	return err
}

func (r *towTruckTypesRepository) GetAll(lang string) (*[]models.TowTruckType, error) {
	var list []models.TowTruckType
	query := fmt.Sprintf(`
		SELECT id, %[1]s as name 
		FROM a_tow_trucks_types 
		ORDER BY %[1]s ASC`, lang)
	err := r.db.Select(&list, query)
	if err != nil {
		return nil, err
	}
	return &list, nil
}

func (r *towTruckTypesRepository) Update(towTruckType *entities.TowTruckType) error {
	query := `
		UPDATE a_tow_trucks_types 
		SET en = :en, es = :es 
		WHERE id = :id`
	_, err := r.db.NamedExec(query, towTruckType)
	return err
}

func (r *towTruckTypesRepository) Delete(id uuid.UUID) error {
	query := `DELETE FROM a_tow_trucks_types WHERE id = $1`
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
