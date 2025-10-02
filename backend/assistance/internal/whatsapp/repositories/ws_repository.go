package repositories

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	dataAssistance "bitbucket.org/mya/mya-assistance-core/internal/assistance/data"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/models"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type WsRepository struct {
	db *sqlx.DB
}

func NewWsRepository(db *sqlx.DB) *WsRepository {
	return &WsRepository{db}
}

func (r *WsRepository) GetBaseWsIds(vehicleTypeKey, weightKey, countryKey uint, modelID uuid.UUID) (*models.BaseWsIds, error) {
	var result models.BaseWsIds

	sql := `
		SELECT 
			(SELECT id FROM a_colors WHERE LOWER(en) = 'none' LIMIT 1) as color_id,
			(SELECT id FROM a_engine_types WHERE LOWER(en) = 'none' LIMIT 1) as engine_type_id,
			(SELECT id FROM a_drive_train_types WHERE LOWER(en) = 'none' LIMIT 1) as drive_train_type_id,
			(SELECT id FROM a_insurances WHERE key = 1 LIMIT 1) as insurance_id,
			(SELECT id FROM a_vehicles_types WHERE key = $1 LIMIT 1) as vehicle_type_id,
			(SELECT id FROM a_weights WHERE key = $2 LIMIT 1) as weight_id,
			(SELECT id FROM a_countries WHERE key = $3 LIMIT 1) as country_id,
			(SELECT m.id  FROM a_vehicles_makes_models mxm JOIN a_vehicles_makes m ON m.id = mxm.make_id WHERE mxm.model_id = $4 LIMIT 1) as make_id
	`

	err := r.db.Get(&result, sql, vehicleTypeKey, weightKey, countryKey, modelID)

	if err != nil {
		return nil, err
	}
	return &result, nil
}

// func (r *WsRepository) GetVehicleModelsByMake(makeName string) (*types.NameReponse, error) {
// 	var result types.NameReponse

// 	sql := `
// 		SELECT
// 			string_agg(mo.name, ' - ') AS name
// 		FROM public.a_vehicles_makes_models mm
// 		JOIN public.a_vehicles_makes ma ON mm.make_id = ma.id
// 		JOIN public.a_vehicles_models mo ON mm.model_id = mo.id
// 		WHERE (ma.name ILIKE '%' || $1 || '%' OR ma.name ILIKE $1 || '%' OR ma.name ILIKE '%' || $1 || '%' OR ma.name ILIKE $1)
// 	`

// 	err := r.db.Get(&result, sql, makeName)

// 	if err != nil {
// 		return nil, err
// 	}
// 	return &result, nil
// }

// func (r *WsRepository) GetVehicleMakeAndModelByModel(modelName string) (*models.VehicleMakeAndModelReponse, error) {
// 	var result models.VehicleMakeAndModelReponse

// 	sql := `
// 		SELECT
// 			ma.make_id AS make_id,
// 			ma.name AS make_name,
// 			mo.model_id AS model_id,
// 			mo.name AS model_name
// 		FROM public.a_vehicles_makes_models mm
// 		JOIN public.a_vehicles_makes ma ON mm.make_id = ma.id
// 		JOIN public.a_vehicles_models mo ON mm.model_id = mo.id
// 		WHERE (mo.name ILIKE '%' || $1 || '%' OR mo.name ILIKE $1 || '%' OR mo.name ILIKE '%' || $1 || '%' OR mo.name ILIKE $1)
// 	`

// 	err := r.db.Get(&result, sql, modelName)

// 	if err != nil {
// 		return nil, err
// 	}
// 	return &result, nil
// }

// func (r *WsRepository) GetVehicleMakeAndModel(vehicleMake string, vehicleModel string) (*models.VehicleMakeAndModelReponse, error) {
// 	var vehicleMakeAndModels models.VehicleMakeAndModelReponse

// 	sql := `
// 		SELECT
// 			mm.make_id AS "make_id",
// 			mm.model_id AS "model_id",
// 			ma.name AS "make_name",
// 			mo.name AS "model_name"
// 		FROM public.a_vehicles_makes_models mm
// 		JOIN public.a_vehicles_makes ma ON mm.make_id = ma.id
// 		JOIN public.a_vehicles_models mo ON mm.model_id = mo.id
// 		WHERE
// 			(mo.name ILIKE '%' || $1 || '%' OR mo.name ILIKE $1 || '%' OR mo.name ILIKE '%' || $1 || '%')
// 			AND
// 			(ma.name ILIKE '%' || $2 || '%' OR ma.name ILIKE $2 || '%' OR ma.name ILIKE '%' || $2 || '%')
// 	`

// 	err := r.db.Get(&vehicleMakeAndModels, sql, vehicleModel, vehicleMake)

// 	if err != nil {
// 		fmt.Println(err)
// 		return nil, err
// 	}
// 	return &vehicleMakeAndModels, nil
// }

func (r *WsRepository) CreateWsUser(user *entities.WsUser) error {
	user.ID = uuid.New()

	query := `
		INSERT INTO public.ws_users (
			identity_document, mobile, email, first_name,
			last_name, identity_document_path, country_key, active
		) VALUES (
			$1, $2, $3, $4, 
			$5, $6, $7, $8
		) RETURNING id
	`

	err := r.db.QueryRowx(query, user.IdentityDocument, user.Mobile, user.Email, user.FirstName, user.LastName, user.IdentityDocumentPath, user.CountryKey, user.Active).Scan(&user.ID)
	if err != nil {
		return err
	}

	return nil
}

func (r *WsRepository) UpdateWsUserActive(id uuid.UUID, active bool) error {
	query := `
		UPDATE public.ws_users
		SET active = $1, updated_at = $2
		WHERE id = $3
	`
	result, err := r.db.Exec(query, active, time.Now().Unix(), id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *WsRepository) GetWsUserByIdentity(identityDocument string) (*entities.WsUser, error) {
	var user entities.WsUser
	query := `
		SELECT id, identity_document, mobile, email, first_name, last_name, identity_document_path, active, country_key
		FROM public.ws_users
		WHERE lower(identity_document) = lower($1)
	`
	err := r.db.Get(&user, query, identityDocument)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	log.Println("bg")
	return &user, nil
}

func (r *WsRepository) GetAssistanceRequestsByUser(identityDocument, mobile string) (*models.AssistanceWS, error) {
	excludedStatusKeys := append(dataAssistance.StatusKeyEnd, status.DriverCompletedKey)

	query := `
		SELECT 
			ar.id AS assistance_id,
			s.id AS status_id,
			s.key AS status_key,
			wu.id AS ws_id,
			wu.mobile AS ws_mobile,
			wu.identity_document AS ws_identity_document,
			wu.email AS ws_email,
			wu.active AS ws_active
		FROM public.a_assistance_requests ar
		JOIN status s ON s.id = ar.status_id AND s.key NOT IN (?)
		JOIN public.ws_users wu ON ar.ws_user_id = wu.id
		WHERE wu.identity_document = ? OR wu.mobile = ?
		LIMIT 1
	`

	query, args, err := sqlx.In(query, excludedStatusKeys, identityDocument, mobile)
	if err != nil {
		return nil, fmt.Errorf("error building query: %v", err)
	}

	query = r.db.Rebind(query)

	var assistanceRequests models.AssistanceWS
	err = r.db.Get(&assistanceRequests, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error executing query: %v", err)
	}

	return &assistanceRequests, nil
}

func (r *WsRepository) UpdateWsMobileActive(mobile string, active bool) error {
	query := `
		UPDATE public.ws_users
		SET active = $1, updated_at = $2
		WHERE mobile = $3
	`

	_, err := r.db.Exec(query, active, time.Now().Unix(), mobile)
	if err != nil {
		return err
	}

	// rowsAffected, err := result.RowsAffected()
	// if err != nil {
	// 	return err
	// }
	// if rowsAffected == 0 {
	// 	return errors.New("user not found")
	// }

	return nil
}
