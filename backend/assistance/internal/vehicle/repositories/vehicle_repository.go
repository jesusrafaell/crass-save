package repositories

import (
	"fmt"
	"log"
	"strings"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type VehicleRepository interface {
	Create(vehicle *entities.Vehicle) *apierrors.CustomError
	GetAll(lang string) (*[]models.Vehicle, error)
	GetByID(id uuid.UUID) (*entities.Vehicle, error)
	GetByIDWithDetails(lang string, id uuid.UUID) (*models.Vehicle, error)

	Update(vehicle *entities.Vehicle) error
	Delete(id uuid.UUID) error
	//
	GetByUserId(lang string, userID uuid.UUID) (*[]models.Vehicle, error)
	GetByLicensePlate(licensePlate string) (*entities.Vehicle, error)
	GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*entities.Vehicle, error)
	DeactivateVehicles(id uuid.UUID) error
	UpdateUserWS(vehicleID, wsUserID uuid.UUID) error
}

type vehicleRepository struct {
	db *sqlx.DB
}

func NewVehicleRepository(db *sqlx.DB) VehicleRepository {
	return &vehicleRepository{db: db}
}

func (r *vehicleRepository) Create(vehicle *entities.Vehicle) *apierrors.CustomError {
	query := `
		INSERT INTO a_vehicles (
			year, license_plate, policy_number, image_path, user_id, active,
			make_id, model_id, type_id, weight_id, engine_type_id, color_id, 
			drive_train_type_id, insurance_id, country_id, ws_user_id
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12,
			$13, $14, $15, $16
		) RETURNING id;
	`

	err := r.db.QueryRowx(query,
		vehicle.Year, vehicle.LicensePlate, vehicle.PolicyNumber, vehicle.ImagePath, vehicle.UserID, vehicle.Active,
		vehicle.MakeID, vehicle.ModelID, vehicle.TypeID, vehicle.WeightID, vehicle.EngineTypeID, vehicle.ColorID,
		vehicle.DriveTrainTypeID, vehicle.InsuranceID, vehicle.CountryID, vehicle.WsUserID,
	).Scan(&vehicle.ID)

	if err != nil {
		log.Printf("Error inserting vehicle: %v", err)
		return parseVehicleError(err)
	}

	return nil
}

func (r *vehicleRepository) GetByID(id uuid.UUID) (*entities.Vehicle, error) {
	var vehicle entities.Vehicle
	rows := r.db.QueryRowx("SELECT * FROM a_vehicles WHERE id = $1 LIMIT 1", id)
	err := rows.StructScan(&vehicle)
	if err != nil {
		return nil, err
	}

	return &vehicle, nil
}

func (r *vehicleRepository) GetByIDWithDetails(lang string, id uuid.UUID) (*models.Vehicle, error) {
	joins := []string{"make", "model", "type", "weight", "engineType", "color", "driveTrainType", "insurance", "country"}
	query := r.QueryVehicleModel(lang, joins)
	query += "WHERE v.id = $1 AND v.deleted_at IS NULL"

	rows, err := r.db.Queryx(query, id)
	if err != nil {
		log.Printf("Error VehicleRepository.GetByUser: %v", err)
		return nil, err
	}

	defer rows.Close()

	var vehicle models.Vehicle
	err = rows.StructScan(&vehicle)
	if err != nil {
		log.Printf("Error Scan Vehicle: %v", err)
		return nil, err
	}

	return &vehicle, nil
}

func (r *vehicleRepository) GetByUserId(lang string, userID uuid.UUID) (*[]models.Vehicle, error) {
	joins := []string{"make", "model", "type", "weight", "engineType", "color", "driveTrainType", "insurance", "country"}
	query := r.QueryVehicleModel(lang, joins)
	query += "WHERE v.user_id = $1 AND v.deleted_at IS NULL ORDER BY v.created_at ASC"

	rows, err := r.db.Queryx(query, userID)
	if err != nil {
		log.Printf("Error VehicleRepository.GetByUser: %v", err)
		return nil, err
	}
	defer rows.Close()

	//solo en vehicleModel
	vehicles := []models.Vehicle{}
	for rows.Next() {
		var vehicle models.Vehicle
		err := rows.StructScan(&vehicle)
		if err != nil {
			log.Printf("Error Scan Vehicle: %v", err)
			return nil, err
		}
		vehicles = append(vehicles, vehicle)
	}
	return &vehicles, nil
}

func (r *vehicleRepository) GetAll(lang string) (*[]models.Vehicle, error) {
	joins := []string{"make", "model", "type", "weight", "engineType", "color", "driveTrainType", "insurance", "country"}
	query := r.QueryVehicleModel(lang, joins)
	query += "WHERE v.deleted_at IS NULL ORDER BY v.created_at ASC"

	rows, err := r.db.Queryx(query)
	if err != nil {
		log.Printf("Error VehicleRepository.GetAll: %v", err)
		return nil, err
	}
	defer rows.Close()

	vehicles := []models.Vehicle{}
	for rows.Next() {
		var vehicle models.Vehicle
		err := rows.StructScan(&vehicle)
		if err != nil {
			log.Printf("Error Scan Vehicle: %v", err)
			return nil, err
		}
		vehicles = append(vehicles, vehicle)
	}
	return &vehicles, nil
}

func (r *vehicleRepository) GetByLicensePlate(licensePlate string) (*entities.Vehicle, error) {
	var vehicle entities.Vehicle
	rows := r.db.QueryRowx("SELECT * FROM a_vehicles WHERE LOWER(license_plate) = LOWER($1) LIMIT 1", licensePlate)
	err := rows.StructScan(&vehicle)
	if err != nil {
		return nil, err
	}

	return &vehicle, nil
}

func (r *vehicleRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*entities.Vehicle, error) {
	var vehicle entities.Vehicle
	rows := r.db.QueryRowx("SELECT * FROM a_vehicles WHERE insurance_id = $1 AND policy_number = $2 LIMIT 1", insuranceID, policyNumber)
	err := rows.StructScan(&vehicle)
	if err != nil {
		return nil, err
	}

	return &vehicle, nil
}

func (r *vehicleRepository) Update(vehicle *entities.Vehicle) error {
	vehicle.UpdatedAt = time.Now().Unix()

	query := `
		UPDATE public.a_vehicles
		SET year = :year,
			license_plate = :license_plate,
			policy_number = :policy_number,
			image_path = :image_path,
			user_id = :user_id,
			active = :active,
			make_id = :make_id,
			model_id = :model_id,
			type_id = :type_id,
			weight_id = :weight_id,
			engine_type_id = :engine_type_id,
			color_id = :color_id,
			drive_train_type_id = :drive_train_type_id,
			insurance_id = :insurance_id,
			country_id = :country_id,
			updated_at = :updated_at
		WHERE id = :id
	`

	_, err := r.db.NamedExec(query, vehicle)
	if err != nil {
		return fmt.Errorf("error actualizando vehículo: %w", err)
	}

	return nil
}

func (r *vehicleRepository) Delete(id uuid.UUID) error {
	query := `
		UPDATE a_vehicles 
		SET 
			year = 0, 
			active = false,
			license_plate = NULL, 
			policy_number = NULL,
			deleted_at = $1, 
			updated_at = $1 
		WHERE id = $2
	`

	result, err := r.db.Exec(query, time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("vehicle not found")
		// return &apierrors.VehicleNotFound
	}

	return nil
}

func parseVehicleError(err error) *apierrors.CustomError {
	//duplicates
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(err.Error(), "\"dat_vehicle_LicensePlate_key\""):
			return &apierrors.ExistLicensePlate
		case strings.Contains(err.Error(), "\"idx_vehicles_image_path\""):
			return &apierrors.ExistImagePath
		}
	}
	//foreign key
	if strings.Contains(err.Error(), "violates foreign key constraint") {
		switch {
		case strings.Contains(err.Error(), "fk_makes_vehicles"):
			return &apierrors.MakeNotFound
		case strings.Contains(err.Error(), "fk_models_vehicles"):
			return &apierrors.ModelNotFound
		case strings.Contains(err.Error(), "fk_type_machines_vehicles"):
			return &apierrors.EngineTypeNotFound
		case strings.Contains(err.Error(), "fk_types_vehicles"):
			return &apierrors.TypeNotFound
		case strings.Contains(err.Error(), "fk_vehicles_weight"):
			return &apierrors.WeightNotFound
		case strings.Contains(err.Error(), "fk_insurances_vehicles"):
			return &apierrors.InsuranceNotFound
		case strings.Contains(err.Error(), "fk_vehicles_color"):
			return &apierrors.ColorNotFound
		}
	}
	errorData := apierrors.InvalidRequest
	errorData.Name = err.Error()
	return &errorData
}

func (r *vehicleRepository) DeactivateVehicles(id uuid.UUID) error {
	query := `UPDATE a_vehicles SET active = false WHERE id != $1`

	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *vehicleRepository) QueryVehicleModel(lang string, joins []string) string {
	selectFields := `
		DISTINCT(v.id), 
		v.year, 
		v.license_plate, 
		COALESCE(v.policy_number, '') AS policy_number, 
		v.image_path, 
		v.user_id, 
		v.active,
		v.created_at,
		v.updated_at
	`

	selectFieldsJoin, joinStatements := r.JoinsVehicleObj(lang, joins)

	selectFields += selectFieldsJoin

	query := fmt.Sprintf(`
        SELECT 
            %s
        FROM a_vehicles v
        %s
    `, selectFields, joinStatements)

	return query
}

func (r *vehicleRepository) JoinsVehicleObj(lang string, joins []string) (string, string) {
	joinClauses := map[string]struct {
		selectClause string
		joinClause   string
	}{
		"make": {
			selectClause: `, vm.id AS "make.id", vm.name AS "make.name"`,
			joinClause:   `LEFT JOIN a_vehicles_makes vm ON v.make_id = vm.id`,
		},
		"model": {
			selectClause: `, vmo.id AS "model.id", vmo.name AS "model.name"`,
			joinClause:   `LEFT JOIN a_vehicles_models vmo ON v.model_id = vmo.id`,
		},
		"type": {
			selectClause: fmt.Sprintf(`, vt.id AS "type.id", vt.key AS "type.key", vt.%s AS "type.name"`, lang),
			joinClause:   `LEFT JOIN a_vehicles_types vt ON v.type_id = vt.id`,
		},
		"weight": {
			selectClause: fmt.Sprintf(`, vw.id AS "weight.id", vw.key AS "weight.key", vw.%s AS "weight.name"`, lang),
			joinClause:   `LEFT JOIN a_weights vw ON v.weight_id = vw.id`,
		},
		"engineType": {
			selectClause: fmt.Sprintf(`, vet.id AS "engineType.id", vet.%s AS "engineType.name"`, lang),
			joinClause:   `LEFT JOIN a_engine_types vet ON v.engine_type_id = vet.id`,
		},
		"color": {
			selectClause: fmt.Sprintf(`, vc.id AS "color.id", vc.%s AS "color.name", vc.hex AS "color.hex"`, lang),
			joinClause:   `LEFT JOIN a_colors vc ON v.color_id = vc.id`,
		},
		"driveTrainType": {
			selectClause: fmt.Sprintf(`, vdtt.id AS "driveTrainType.id", vdtt.%s AS "driveTrainType.name"`, lang),
			joinClause:   `LEFT JOIN a_drive_train_types vdtt ON v.drive_train_type_id = vdtt.id`,
		},
		"insurance": {
			selectClause: `, vi.id AS "insurance.id", vi.name AS "insurance.name", vi.key AS "insurance.key"`,
			joinClause:   `LEFT JOIN a_insurances vi ON v.insurance_id = vi.id`,
		},
		"country": {
			selectClause: fmt.Sprintf(`, vco.id AS "country.id", vco.%s AS "country.name"`, lang),
			joinClause:   `LEFT JOIN a_countries vco ON v.country_id = vco.id`,
		},
	}

	var selectFields string
	var joinStatements string

	for _, join := range joins {
		if clause, ok := joinClauses[join]; ok {
			selectFields += clause.selectClause
			joinStatements += "\n" + clause.joinClause
		}
	}

	return selectFields, joinStatements
}

func (r *vehicleRepository) UpdateUserWS(vehicleID, wsUserID uuid.UUID) error {
	query := `
		UPDATE public.a_vehicles
		SET
			ws_user_id = $2,
			updated_at = $3 
		WHERE id = $1
	`

	result, err := r.db.Exec(query, vehicleID, wsUserID, time.Now().Unix())

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("vehicle not found")
	}

	return nil
}
