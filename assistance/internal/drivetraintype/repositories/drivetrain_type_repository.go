package repositories

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type DriveTrainTypeRepository interface {
	GetByID(lang string, id uuid.UUID) (*models.DriveTrainType, error)
	Create(driveTrainType *entities.DriveTrainType) error
	GetAll(lang string) (*[]models.DriveTrainType, error)
	Update(driveTrainType *entities.DriveTrainType) error
	Delete(id uuid.UUID) error
}

type driveTrainTypeRepository struct {
	db *sqlx.DB
}

func NewDriveTrainTypeRepository(db *sqlx.DB) DriveTrainTypeRepository {
	return &driveTrainTypeRepository{db: db}
}

func (r *driveTrainTypeRepository) GetByID(lang string, id uuid.UUID) (*models.DriveTrainType, error) {
	var driveTrainType models.DriveTrainType
	query := fmt.Sprintf(`SELECT id, %s AS name FROM a_drive_train_types WHERE id = $1`, lang)
	err := r.db.Get(&driveTrainType, query, id)
	return &driveTrainType, err
}

func (r *driveTrainTypeRepository) Create(driveTrainType *entities.DriveTrainType) error {
	_, err := r.db.NamedExec(`INSERT INTO a_drive_train_types (en, es) VALUES (:en, :es)`, driveTrainType)
	return err
}

func (r *driveTrainTypeRepository) GetAll(lang string) (*[]models.DriveTrainType, error) {
	var driveTrainTypes []models.DriveTrainType
	query := fmt.Sprintf(`
		SELECT id, %s AS name 
		FROM a_drive_train_types 
		WHERE LOWER(%s) != 'none' 
		ORDER BY created_at ASC`, lang, lang)
	err := r.db.Select(&driveTrainTypes, query)
	return &driveTrainTypes, err
}

func (r *driveTrainTypeRepository) Update(driveTrainType *entities.DriveTrainType) error {
	_, err := r.db.NamedExec(`UPDATE a_drive_train_types SET en = :en, es = :es WHERE id = :id`, driveTrainType)
	return err
}

func (r *driveTrainTypeRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec(`DELETE FROM a_drive_train_types WHERE id = $1`, id)
	return err
}
