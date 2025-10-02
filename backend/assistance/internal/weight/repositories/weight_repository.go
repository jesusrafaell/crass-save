package repositories

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/weight/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type WeightRepository interface {
	GetByID(lang string, id uuid.UUID) (*models.Weight, error)
	GetAll(lang string) (*[]models.Weight, error)
	GetByKey(lang string, key uint) (*models.Weight, error)
	GetByTypeID(typeID uuid.UUID, lang string) (*[]models.Weight, error)
	Create(weight *entities.Weight) error
	Update(weight *entities.Weight) error
	Delete(id uuid.UUID) error
}

type weightRepository struct {
	db *sqlx.DB
}

func NewWeightRepository(db *sqlx.DB) WeightRepository {
	return &weightRepository{db: db}
}

func (r *weightRepository) GetByID(lang string, id uuid.UUID) (*models.Weight, error) {
	var weight models.Weight
	query := fmt.Sprintf("SELECT id, %s as name, key FROM a_weights WHERE id = $1", lang)

	err := r.db.Get(&weight, query, id)
	if err != nil {
		return nil, err
	}
	return &weight, nil
}

func (r *weightRepository) GetByTypeID(typeID uuid.UUID, lang string) (*[]models.Weight, error) {
	var weights []models.Weight
	query := fmt.Sprintf("SELECT id, %s as name, key FROM a_weights WHERE type_id = $1 ORDER BY id", lang)

	err := r.db.Select(&weights, query, typeID)
	if err != nil {
		return nil, err
	}
	return &weights, nil
}

func (r *weightRepository) Create(weight *entities.Weight) error {
	_, err := r.db.NamedExec(`INSERT INTO a_weights (en, es, key, type_id) VALUES (:en, :es, :key, :type_id)`, weight)
	return err
}

func (r *weightRepository) GetAll(lang string) (*[]models.Weight, error) {
	var weights []models.Weight
	query := fmt.Sprintf("SELECT id, %s as name, key FROM a_weights ORDER BY id", lang)

	err := r.db.Select(&weights, query)
	if err != nil {
		return nil, fmt.Errorf("error weight_repository.GetAll %v", err)
	}
	return &weights, nil
}

func (r *weightRepository) GetByKey(lang string, key uint) (*models.Weight, error) {
	var weight models.Weight
	query := fmt.Sprintf("SELECT id, %s as name, key FROM a_weights WHERE key = $1", lang)

	err := r.db.Get(&weight, query, key)
	if err != nil {
		return nil, fmt.Errorf("error weightRepository.GetByKey: %v", err)
	}

	return &weight, nil
}

func (r *weightRepository) Update(weight *entities.Weight) error {
	_, err := r.db.NamedExec(`UPDATE a_weights SET en = :en, es = :es, key = :key WHERE id = :id`, weight)
	return err
}

func (r *weightRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_weights WHERE id = $1", id)
	return err
}
