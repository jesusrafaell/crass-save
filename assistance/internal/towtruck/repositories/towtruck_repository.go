package repositories

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TowTruckRepository interface {
	GetAll(lang string) (towTrucks *[]models.TowTruck, err error)
	GetByID(id uuid.UUID) (towTruck *entities.TowTruck, err error)
	Create(towTruck *entities.TowTruck) *apierrors.CustomError
	Update(data *entities.TowTruck) *apierrors.CustomError
	Delete(id uuid.UUID) (error, bool)
	GetByLicensePlate(licensePlate string) (towTruck *entities.TowTruck, err error)
	GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (towTruck *entities.TowTruck, err error)
	GetByUserID(lang string, driverId uuid.UUID) (towTrucks *[]models.TowTruck, err error)
	GetOneByUserID(lang string, userID uuid.UUID) (towTruck *models.TowTruck, err error)
	DeactivateTowTrucks(ttId uuid.UUID, driverId uuid.UUID) error
	GetAllByCompanyId(lang string, companyId uuid.UUID) (towTrucks *[]models.TowTruck, err error)
	CreateExpenseHistory(data *entities.TowTruckExpenseHistory) *apierrors.CustomError
	GetExpenseHistoryByCompanyId(companyId uuid.UUID) (expenseHistories *[]entities.TowTruckExpenseHistory, errr error)
	GetExpenseHistoryByTTId(ttId uuid.UUID, expenseType *uint) (expenseHistories *[]entities.TowTruckExpenseHistory, err error)
}

type towTruckRepository struct {
	db *sqlx.DB
}

func NewTowTruckRepository(db *sqlx.DB) TowTruckRepository {
	return &towTruckRepository{db}
}

func (r *towTruckRepository) GetByID(id uuid.UUID) (*entities.TowTruck, error) {
	var towTruck entities.TowTruck
	rows := r.db.QueryRowx("SELECT * FROM a_tow_trucks WHERE id = $1 LIMIT 1", id)
	err := rows.StructScan(&towTruck)
	if err != nil {
		return nil, err
	}

	return &towTruck, nil
}

func (r *towTruckRepository) GetByLicensePlate(licensePlate string) (*entities.TowTruck, error) {
	var towTruck entities.TowTruck
	rows := r.db.QueryRowx("SELECT * FROM a_tow_trucks WHERE license_plate = $1 LIMIT 1", licensePlate)
	err := rows.StructScan(&towTruck)
	if err != nil {
		return nil, err
	}

	return &towTruck, nil
}

func (r *towTruckRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*entities.TowTruck, error) {
	var towTruck entities.TowTruck
	rows := r.db.QueryRowx("SELECT * FROM a_tow_trucks WHERE insurance_id = $1 AND policy_number = $2 LIMIT 1", insuranceID, policyNumber)
	err := rows.StructScan(&towTruck)
	if err != nil {
		return nil, err
	}

	return &towTruck, nil
}

func (r *towTruckRepository) Create(towTruck *entities.TowTruck) *apierrors.CustomError {
	query := `
		INSERT INTO a_tow_trucks (
			year, license_plate, policy_number, image_path, company_id, driver_id, active, make_id, engine_type_id, color_id, drive_train_type_id, insurance_id, country_id, weight_id, type_id
		) 
		VALUES (
			:year, :license_plate, :policy_number, :image_path, :company_id, :driver_id, :active, :make_id, :engine_type_id, :color_id, :drive_train_type_id, :insurance_id, :country_id, :weight_id, :type_id
		)`

	_, err := r.db.NamedExec(query, towTruck)
	if err != nil {
		log.Printf("Error inserting towtruck: %v", err)
		return parsetowTruckError(err)
	}

	return nil
}

func (r *towTruckRepository) GetAll(lang string) (*[]models.TowTruck, error) {
	joins := []string{"all"}
	query := r.QueryTowTruckObj(lang, joins)
	query += "WHERE tt.deleted_at IS NULL ORDER BY tt.created_at ASC"

	rows, err := r.db.Queryx(query)
	if err != nil {
		log.Printf("Error TowTruckRepository.GetAll: %v", err)
		return nil, err
	}
	defer rows.Close()

	towTrucks := []models.TowTruck{}
	for rows.Next() {
		var towTruck models.TowTruck
		err := rows.StructScan(&towTruck)
		if err != nil {
			log.Printf("Error Scan TowTruck: %v", err)
			return nil, err
		}
		towTrucks = append(towTrucks, towTruck)
	}
	return &towTrucks, nil
}

func (r *towTruckRepository) GetByUserID(lang string, driverId uuid.UUID) (*[]models.TowTruck, error) {
	joins := []string{"color", "weight", "make", "craneType", "country", "engineType", "driveTrainType", "insurance"}
	query := r.QueryTowTruckObj(lang, joins)
	query += "WHERE tt.driver_id = $1 AND tt.deleted_at IS NULL ORDER by tt.created_at ASC"

	rows, err := r.db.Queryx(query, driverId)
	if err != nil {
		log.Printf("Error TowTruckRepository.GetByUserID: %v", err)
		return nil, err
	}
	defer rows.Close()

	towTrucks := []models.TowTruck{}
	for rows.Next() {
		var towTruck models.TowTruck
		err := rows.StructScan(&towTruck)
		if err != nil {
			log.Printf("Error Scan TowTrucke: %v", err)
			return nil, err
		}
		towTrucks = append(towTrucks, towTruck)
	}
	return &towTrucks, nil
}

func (r *towTruckRepository) GetOneByUserID(lang string, userID uuid.UUID) (*models.TowTruck, error) {
	joins := []string{"color", "weight", "make", "craneType", "country", "engineType", "driveTrainType", "insurance"}
	query := r.QueryTowTruckObj(lang, joins) + "WHERE tt.driver_id = $1 AND tt.deleted_at IS NULL LIMITE 1"

	rows, err := r.db.Queryx(query, userID)
	if err != nil {
		log.Printf("Error TowTruckRepository.GetOneByUserID: %v", err)
		return nil, err
	}
	defer rows.Close()

	var towTruck models.TowTruck
	err = rows.StructScan(&towTruck)
	if err != nil {
		log.Printf("Error Scan TowTrucke: %v", err)
		return nil, err
	}
	return &towTruck, nil
}

func (r *towTruckRepository) Update(data *entities.TowTruck) *apierrors.CustomError {
	query := `
		UPDATE a_tow_trucks SET
			year = :year,
			license_plate = :license_plate,
			policy_number = :policy_number,
			image_path = :image_path,
			company_id = :company_id,
			driver_id = :driver_id,
			active = :active,
			make_id = :make_id,
			engine_type_id = :engine_type_id,
			color_id = :color_id,
			drive_train_type_id = :drive_train_type_id,
			insurance_id = :insurance_id,
			country_id = :country_id,
			weight_id = :weight_id,
			type_id = :type_id
		WHERE id = :id
	`

	_, err := r.db.NamedExec(query, data)
	if err != nil {
		return parsetowTruckError(err)
	}

	return nil
}

func (r *towTruckRepository) DeactivateTowTrucks(ttId uuid.UUID, driverId uuid.UUID) error {
	//inactive other towtruck
	query := `
		UPDATE a_tow_trucks
		SET active = false 
		WHERE driver_id = $2 AND id != $1
	`

	_, err := r.db.Exec(query, ttId, driverId)
	if err != nil {
		return err
	}

	return nil
}

func (r *towTruckRepository) Delete(id uuid.UUID) (error, bool) {
	query := `
		UPDATE a_tow_trucks
		SET 
			driver_id = NULL, 
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
		return err, false
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err, false
	}

	if rowsAffected == 0 {
		// return apierrors.TowtruckNotFound
		return nil, false
	}

	return nil, true
}

func parsetowTruckError(err error) *apierrors.CustomError {
	// duplicate
	if strings.Contains(strings.ToLower(err.Error()), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(strings.ToLower(err.Error()), "license_plate_key"):
			return &apierrors.ExistLicensePlate
		case strings.Contains(strings.ToLower(err.Error()), "image_path"):
			return &apierrors.ExistImagePath
		}
	}

	// fk
	if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
		switch {
		case strings.Contains(strings.ToLower(err.Error()), "makes"):
			return &apierrors.MakeNotFound
		case strings.Contains(strings.ToLower(err.Error()), "modelss"):
			return &apierrors.ModelNotFound
		case strings.Contains(strings.ToLower(err.Error()), "engine_types"):
			return &apierrors.EngineTypeNotFound
		case strings.Contains(strings.ToLower(err.Error()), "car_types"):
			return &apierrors.TypeNotFound
		case strings.Contains(strings.ToLower(err.Error()), "weights_tow_truck"):
			return &apierrors.WeightNotFound
		case strings.Contains(strings.ToLower(err.Error()), "insurances_tow_truck"):
			return &apierrors.InsuranceNotFound
		case strings.Contains(strings.ToLower(err.Error()), "tow_truck_color"):
			return &apierrors.ColorNotFound
		}
	}

	// Manejador por defecto para errores desconocidos o no controlados
	return apierrors.NewCustomErrMsg(&apierrors.InvalidRequest, err.Error())
}

func (r *towTruckRepository) GetAllByCompanyId(lang string, companyId uuid.UUID) (*[]models.TowTruck, error) {
	joins := []string{"all"}
	query := r.QueryTowTruckObj(lang, joins) + " WHERE tt.company_id = $1 AND tt.deleted_at IS NULL ORDER BY tt.created_at ASC"

	var towTruck []models.TowTruck

	err := r.db.Select(&towTruck, query, companyId)
	if err != nil {
		log.Printf("Error TowTruckRepository.GetAllCompanyId: %v", err)
		return nil, err
	}

	return &towTruck, nil
}

// Crear el historial de gastos de TowTruck
func (r *towTruckRepository) CreateExpenseHistory(data *entities.TowTruckExpenseHistory) *apierrors.CustomError {
	query := `
		INSERT INTO public.a_tow_truck_expense_histories (
			company_id, tow_truck_id, user_id, amount, coin_id, unix_date, 
			fuel_liters, repair_description, expense_type
		)
		VALUES (
			:company_id, :tow_truck_id, :user_id, :amount, :coin_id, :unix_date, 
			:fuel_liters, :repair_description, :expense_type
		)
	`

	// Ejecutar la consulta usando NamedExec, que mapea los campos del struct a la consulta SQL
	_, err := r.db.NamedExec(query, data)
	if err != nil {
		log.Printf("Error en repository.CreateExpenseHistory: %v", err)
		return &apierrors.InvalidRequest
	}

	return nil
}

func (r *towTruckRepository) GetExpenseHistoryByTTId(ttId uuid.UUID, expenseType *uint) (*[]entities.TowTruckExpenseHistory, error) {
	var list []entities.TowTruckExpenseHistory

	query := ` 
		SELECT 
			eth.id, eth.tow_truck_id, eth.expense_type, eth.company_id, eth.user_id, eth.amount, eth.unix_date, eth.fuel_liters, eth.repair_description, eth.coin_id,
			c.id AS "coin.id", c.name AS "coin.name", c.symbol AS "coin.symbol", c.key AS "coin.key"
		FROM 
			a_tow_truck_expense_histories eth
		LEFT JOIN coins c ON eth.coin_id = c.id
		WHERE 
			eth.tow_truck_id = $1
	`

	// Agregar condición de tipo de gasto si se proporciona
	args := []interface{}{ttId}
	if expenseType != nil {
		query += " AND eth.expense_type = $2"
		args = append(args, *expenseType)
	}

	// Ordenamos por fecha de creación (created_at)
	query += " ORDER BY eth.created_at DESC"

	err := r.db.Select(&list, query, args...)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Si no se encuentran registros, devolvemos una lista vacía
			return &list, nil
		}
		// Devolvemos el error si ocurre uno
		return nil, err
	}

	return &list, nil
}

func (r *towTruckRepository) GetExpenseHistoryByCompanyId(companyId uuid.UUID) (*[]entities.TowTruckExpenseHistory, error) {
	var list []entities.TowTruckExpenseHistory

	// Construimos la consulta SQL
	query := `
		SELECT 
			id, tow_truck_id, expense_type, company_id, user_id, amount, unix_date, fuel_liters, repair_description, coin_id
		FROM 
			a_tow_truck_expense_histories
		WHERE 
			company_id = $1
		ORDER BY 
			created_at DESC
	`

	// Ejecutamos la consulta con SQLX
	err := r.db.Select(&list, query, companyId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return &list, nil
		}
		return nil, err
	}

	return &list, nil
}

func (r *towTruckRepository) QueryTowTruckObj(lang string, joins []string) string {
	selectFields := `
		DISTINCT(tt.id),
		tt.year,
		tt.license_plate,
		COALESCE(tt.policy_number, '') AS policy_number, 
		tt.image_path,
		tt.driver_id,
		tt.active,
		tt.created_at,
		tt.updated_at`

	joinClauses := map[string]struct {
		selectClause string
		joinClause   string
	}{
		"driver": {
			// selectClause: `,
			// u.id AS "driver.id", u.first_name AS "driver.first_name", u.last_name AS "driver.last_name", u.email AS "driver.email", u.mobile AS "driver.mobile"`,
			selectClause: `,
				CASE WHEN tt.driver_id IS NOT NULL THEN
					jsonb_build_object(
						'id', u.id,
						'firstName', u.first_name,
						'lastName', u.last_name,
						'email', u.email,
						'mobile', u.mobile
					)
					ELSE NULL
				END AS driver
			`,
			joinClause: `LEFT JOIN u_users u ON tt.driver_id = u.id`,
		},
		"company": {
			selectClause: `, com.id AS "company.id", com.name AS "company.name", com.key AS "company.key"`,
			joinClause:   `LEFT JOIN u_companies com ON tt.company_id = com.id`,
		},
		"make": {
			selectClause: `, m.id AS "make.id", m.name AS "make.name"`,
			joinClause:   `LEFT JOIN a_tow_trucks_makes m ON tt.make_id = m.id`,
		},
		"craneType": {
			selectClause: fmt.Sprintf(`, ct.id AS "craneType.id", ct.%s AS "craneType.name"`, lang),
			joinClause:   `LEFT JOIN a_tow_trucks_types ct ON tt.type_id = ct.id`,
		},
		"engineType": {
			selectClause: fmt.Sprintf(`, et.id AS "engineType.id", et.%s AS "engineType.name"`, lang),
			joinClause:   `LEFT JOIN a_engine_types et ON tt.engine_type_id = et.id`,
		},
		"weight": {
			selectClause: fmt.Sprintf(`, w.id AS "weight.id", w.key AS "weight.key", w.%s AS "weight.name"`, lang),
			joinClause:   `LEFT JOIN a_weights w ON tt.weight_id = w.id`,
		},
		"color": {
			selectClause: fmt.Sprintf(`, c.id AS "color.id", c.%s AS "color.name", c.hex AS "color.hex"`, lang),
			joinClause:   `LEFT JOIN a_colors c ON tt.color_id = c.id`,
		},
		"driveTrainType": {
			selectClause: fmt.Sprintf(`, dtt.id AS "driveTrainType.id", dtt.%s AS "driveTrainType.name"`, lang),
			joinClause:   `LEFT JOIN a_drive_train_types dtt ON tt.drive_train_type_id = dtt.id`,
		},
		"insurance": {
			selectClause: `, i.id AS "insurance.id", i.name AS "insurance.name"`,
			joinClause:   `LEFT JOIN a_insurances i ON tt.insurance_id = i.id`,
		},
		"country": {
			selectClause: fmt.Sprintf(`, cou.id AS "country.id", cou.%s AS "country.name"`, lang),
			joinClause:   `LEFT JOIN a_countries cou ON tt.country_id = cou.id`,
		},
	}

	// 'joins' contain 'all' -> all joinClauses
	if len(joins) == 1 && joins[0] == "all" {
		joins = make([]string, 0, len(joinClauses))
		for join := range joinClauses {
			joins = append(joins, join)
		}
	}

	var joinStatements string

	for _, join := range joins {
		if clause, ok := joinClauses[join]; ok {
			selectFields += "\n" + clause.selectClause
			joinStatements += "\n" + clause.joinClause
		}
	}

	query := fmt.Sprintf(`SELECT %s 
		FROM a_tow_trucks tt %s
    `, selectFields, joinStatements)

	return query
}
