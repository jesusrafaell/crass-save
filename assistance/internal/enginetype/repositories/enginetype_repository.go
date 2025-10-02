package repositories

import (
	"fmt"
	"log"

	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type EngineTypeRepository interface {
	GetAll(lang string) (*[]models.EngineType, error)
	// GetByID(id uuid.UUID) (engineType *models.EngineType, err error)
	// Create(engineType *models.EngineType) error
	// Update(engineType *models.EngineType) error
	// Delete(id uuid.UUID) error
}

type engineTypeRepository struct {
	db *sqlx.DB
}

func NewEngineTypeRepository(db *sqlx.DB) EngineTypeRepository {
	return &engineTypeRepository{db: db}
}

func (r *engineTypeRepository) GetByID(id uuid.UUID) (*models.EngineType, error) {
	var engineType models.EngineType
	query := `SELECT id, name FROM a_engine_types WHERE id = $1`
	err := r.db.Get(&engineType, query, id)
	if err != nil {
		return nil, err
	}
	return &engineType, nil
}

// func (r *engineTypeRepository) GetByName(lang, name string) (*EngineType, error) {
// 	var data EngineType
// 	query := fmt.Sprintf(`SELECT id, %s as name FROM a_engine_types WHERE LOWER(%s) = LOWER($1)`, lang, lang)
// 	err := r.db.Get(&data, query, name)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &data, nil
// }

func (r *engineTypeRepository) Create(engineType *models.EngineType) error {
	query := `
		INSERT INTO a_engine_types (en, es) 
		VALUES (:en, :es)`
	_, err := r.db.NamedExec(query, engineType)
	return err
}

func (r *engineTypeRepository) GetAll(lang string) (*[]models.EngineType, error) {
	var engineTypes []models.EngineType
	query := fmt.Sprintf(`
		SELECT id, %[1]s as name 
		FROM a_engine_types 
		WHERE LOWER(en) != 'none' 
		ORDER BY %[1]s ASC`, lang)
	err := r.db.Select(&engineTypes, query)
	if err != nil {
		return nil, err
	}
	return &engineTypes, nil
}

func (r *engineTypeRepository) Update(engineType *models.EngineType) error {
	query := `
		UPDATE a_engine_types 
		SET en = :en, es = :es 
		WHERE id = :id`
	_, err := r.db.NamedExec(query, engineType)
	return err
}

func (r *engineTypeRepository) Delete(id uuid.UUID) error {
	query := `DELETE FROM a_engine_types WHERE id = $1`
	_, err := r.db.Exec(query, id)
	if err != nil {
		log.Printf("Error deleting EngineType: %v", err)
		return err
	}
	return nil
}
