package repositories

import (
	"fmt"
	"log"
	"strings"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/data"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/preloads"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type assistanceRepository struct {
	db           *gorm.DB
	roleDriverId uuid.UUID
}

func NewAssistanceRepository(db *gorm.DB) AssistanceRepository {
	var roleDriver userModel.Roles
	err := db.Where("key = ?", 3).First(&roleDriver).Error
	if err != nil {
		log.Panic("Error assistance(role):", err)
	}
	return &assistanceRepository{
		db:           db,
		roleDriverId: roleDriver.ID,
	}
}

func (r *assistanceRepository) Create(data *entities.Assistance) *apierrors.CustomError {
	result := r.db.Create(data)
	if result.Error != nil {
		log.Printf("Error AssistanceRepository.Create: %v", result.Error)
		return parseAssistanceError(result.Error)
	}
	return nil
}

func (r *assistanceRepository) Update(data *entities.Assistance) error {
	result := r.db.Save(&data)
	return result.Error
}

func (r *assistanceRepository) Delete(id uuid.UUID) error {
	result := r.db.Delete(&entities.Assistance{}, id)
	return result.Error
}

func (r *assistanceRepository) GetByID(id uuid.UUID, options ...preloads.PreloadOption) (*entities.Assistance, error) {
	var assistance entities.Assistance
	db := r.db

	for _, option := range options {
		db = option(db)
	}

	result := db.First(&assistance, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &assistance, nil
}

func (r *assistanceRepository) GetByUserID(userID uuid.UUID) (*entities.Assistance, error) {
	var assistance entities.Assistance
	result := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Not("status.key", data.StatusKeyEnd).
		Where("user_id = ?", userID).
		Preload("User").
		Preload("Driver").
		Preload("Vehicle").
		Preload("Status").
		Preload("Coin").
		Preload("Company").
		Preload("Vehicle", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Make").
				Preload("Model").
				Preload("Type").
				Preload("EngineType").
				Preload("Weight").
				Preload("Color").
				Preload("DriveTrainType")
		}).
		Preload("TowTruck", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Make").
				Preload("Type").
				Preload("Color")
		}).
		First(&assistance)
	if result.Error != nil {
		return nil, result.Error
	}

	return &assistance, nil
}

func (r *assistanceRepository) GetByDriverID(driverID uuid.UUID) (*entities.Assistance, error) {
	excludedStatuses := append(data.StatusKeyEnd, status.DriverCompletedKey)
	var assistance entities.Assistance
	result := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Not("status.key", excludedStatuses).
		Where("driver_id = ?", driverID).
		Preload("User").
		Preload("WSUser").
		Preload("Driver").
		Preload("Vehicle").
		Preload("Status").
		Preload("Coin").
		Preload("Company").
		Preload("Vehicle", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Make").
				Preload("Model").
				Preload("Type").
				Preload("EngineType").
				Preload("Weight").
				Preload("Color").
				Preload("DriveTrainType")
		}).Preload("TowTruck", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Make").
			Preload("Type").
			Preload("Color")
	}).First(&assistance)
	if result.Error != nil {
		return nil, result.Error
	}

	return &assistance, nil
}

func (r *assistanceRepository) GetByFilter(reqId, userId, driverId *uuid.UUID) (*entities.Assistance, error) {
	var data entities.Assistance
	var where string
	if reqId != nil {
		where = fmt.Sprintf("id = '%s'", *reqId)
	}
	if userId != nil {
		where = fmt.Sprintf("user_id = '%s'", *userId)
	}
	if driverId != nil {
		where = fmt.Sprintf("driver_id = '%s'", *driverId)
	}
	result := r.db.
		Where(where).
		//data user driver
		Preload("User").
		Preload("Driver").
		Preload("WSUser").
		// normal
		Preload("Vehicle").
		Preload("Vehicle.Make").
		Preload("Vehicle.Model").
		Preload("Vehicle.Type").
		Preload("Vehicle.EngineType").
		Preload("Vehicle.Weight").
		Preload("Vehicle.Color").
		Preload("Vehicle.DriveTrainType").
		Preload("TowTruck").
		Preload("TowTruck.Make").
		Preload("TowTruck.Type").
		Preload("TowTruck.Color").
		Preload("Status").
		Preload("Coin").
		// Preload("Insurance").
		Order("created_at DESC").
		First(&data)
	if result.Error != nil {
		log.Printf("Error AssistanceRepository.GetByFilter: %v", result.Error)
		return nil, result.Error
	}

	return &data, nil
}

func (r *assistanceRepository) GetPendingByDriverID(driverID uuid.UUID) (*[]entities.Assistance, error) {
	var list []entities.Assistance
	result := r.db.Joins("JOIN a_request_drivers ard ON ard.request_id = a_assistance_requests.id AND ard.driver_id = ?", driverID).
		Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Preload("User").
		Preload("WSUser").
		Preload("Vehicle").
		Preload("Vehicle.Make").
		Preload("Vehicle.Model").
		Preload("Vehicle.Type").
		Preload("Vehicle.EngineType").
		Preload("Vehicle.Weight").
		Preload("Vehicle.Color").
		Preload("Vehicle.DriveTrainType").
		Preload("Status").
		// Preload("Insurance").
		Preload("Coin").
		Select("a_assistance_requests.*, ard.total_distance AS total_distance, ard.price AS price, ard.coin_id AS coin_id").
		Where("status.key = ? ", status.ActiveKey).
		Order("created_at ASC").
		Find(&list)
	return &list, result.Error
}

func (r *assistanceRepository) GetByUserAndStatus(userId uuid.UUID, statusID uuid.UUID) (*entities.Assistance, error) {
	var data entities.Assistance
	result := r.db.Where("user_id = ? and status_id = ?", userId, statusID).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (r *assistanceRepository) ValidStatusRequest(userId, driverId *uuid.UUID) (*entities.Assistance, error) {
	var assistance entities.Assistance
	var where string

	excludedStatus := data.StatusKeyEnd
	if userId != nil {
		where = fmt.Sprintf("user_id = '%s'", *userId)
	} else if driverId != nil {
		where = fmt.Sprintf("driver_id = '%s'", *driverId)
		excludedStatus = append(excludedStatus, status.DriverCompletedKey)
	}
	result := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Not("status.key", excludedStatus).Where(where).First(&assistance)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &assistance, nil
}

func parseAssistanceError(err error) *apierrors.CustomError {
	//duplicates
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path1\""):
			return &apierrors.AssistanceImagesDuplicate
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path2\""):
			return &apierrors.AssistanceImagesDuplicate
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path3\""):
			return &apierrors.AssistanceImagesDuplicate
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path4\""):
			return &apierrors.AssistanceImagesDuplicate
		}
	}

	errorData := apierrors.NewCustomErrMsg(&apierrors.AssistRequestFail, err.Error())
	return errorData
}

func (r *assistanceRepository) GetDashboardDataByCompany(companyId *uuid.UUID) (*models.DashboarData, error) {

	var dashboarData models.DashboarData
	// Total services
	r.db.Model(&entities.Assistance{}).
		Where("company_id = ?", companyId).
		Count(&dashboarData.Services.Total)

	// acitve
	r.db.Model(&entities.Assistance{}).
		Where("company_id = ? AND active = true", companyId).
		Count(&dashboarData.Services.Active)

	// cancelled
	r.db.Model(&entities.Assistance{}).
		Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Where("company_id = ? AND status.key = ?", companyId, "cancelled").
		Count(&dashboarData.Services.Cancelled)

		// completed
	r.db.Model(&entities.Assistance{}).
		Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Where("company_id = ? AND status.key IN ?", companyId, data.StatusKeysCompleted).
		Count(&dashboarData.Services.Completed)

	// pending
	r.db.Model(&entities.Assistance{}).
		Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Where("driver_id IS NULL AND company_id IS NULL AND status.key = ?", status.ActiveKey).
		Count(&dashboarData.Services.Pending)

		//total drivers

	var stats models.DriverStats

	if companyId == nil {
		r.db.Raw(`
        SELECT
            COUNT(u.id) AS total,
            COUNT(CASE WHEN u.online = true THEN 1 END) AS online
        FROM u_users u
        WHERE ? = ANY (u.roles_id)
        AND u.company_id IS NULL
    `, r.roleDriverId).Scan(&stats)
	} else {
		r.db.Raw(`
        SELECT
            COUNT(u.id) AS total,
            COUNT(CASE WHEN u.online = true THEN 1 END) AS online
        FROM u_users u
        WHERE ? = ANY (u.roles_id)
        AND u.company_id = ?
    `, r.roleDriverId, companyId).Scan(&stats)
	}

	// drivers active
	// r.db.Raw("SELECT COUNT(*) FROM u_users WHERE online = true AND company_id = ?", companyId).Scan(&data.Drivers.Active)
	dashboarData.Drivers.Total = stats.Total
	dashboarData.Drivers.Active = stats.Online

	//drivers inactive
	dashboarData.Drivers.Inactive = dashboarData.Drivers.Total - dashboarData.Drivers.Active

	return &dashboarData, nil
}

func (r *assistanceRepository) GetAllByCompanyId(companyId *uuid.UUID, filter *models.FilterDashboardRequest) (*[]entities.Assistance, error) {
	var list []entities.Assistance
	query := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Preload("User").
		Preload("WSUser").
		Preload("Driver").
		Preload("Status").
		Preload("Coin").
		Preload("Vehicle", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Make").
				Preload("Model").
				Preload("Type").
				Preload("EngineType").
				Preload("Weight").
				Preload("Color").
				Preload("DriveTrainType")
		}).Preload("TowTruck", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Make").
			Preload("Type").
			Preload("Color")
	}).
		Order("created_at DESC")

	if filter.Status != nil {
		statusFilter := *filter.Status
		if statusFilter == status.PendingKey { //not have company
			query = query.Where("status.key = ? AND company_id IS NULL AND driver_id IS NULL", status.ActiveKey)
		} else if statusFilter == status.CompletedKey { //completed
			query = query.Where("status.key IN ? AND company_id = ?", data.StatusKeysCompleted, companyId)
		} else if statusFilter == status.ActiveKey { //active
			// query = query.Where("status.key IN ?", r.statusKeysOn)
			query = query.Where("active = true AND company_id = ?", companyId)
		} else { //cancelled
			query = query.Where("status.key = ? AND company_id = ?", statusFilter, companyId)
		}
	} else {
		query = query.Where("company_id = ?", companyId)
	}

	result := query.Find(&list)
	return &list, result.Error
}

func (r *assistanceRepository) GetList(filter *models.ParamsRequestGet) (*[]entities.Assistance, error) {
	var list []entities.Assistance

	query := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Preload("User").
		Preload("WSUser").
		Preload("Driver").
		Preload("Status").
		Preload("Coin").
		Preload("Company").
		Preload("Vehicle", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Make").
				Preload("Model").
				Preload("Type").
				Preload("EngineType").
				Preload("Weight").
				Preload("Color").
				Preload("DriveTrainType")
		}).Preload("TowTruck", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Make").
			Preload("Type").
			Preload("Color")
	}).
		Order("created_at DESC")

	if filter.DriverId != nil {
		query = query.Where("driver_id = ?", filter.DriverId)
	}
	if filter.UserId != nil {
		query = query.Where("user_id = ?", filter.UserId)
	}
	if filter.CompanyId != nil {
		query = query.Where("company_id = ?", filter.CompanyId)
	}
	if filter.TowTruckId != nil {
		query = query.Where("tow_truck_id = ?", filter.TowTruckId)
	}

	if filter.Status != nil {
		statusFilter := *filter.Status
		if statusFilter == status.PendingKey {
			query = query.Where("status.key = ? AND company_id IS NULL AND driver_id IS NULL", status.ActiveKey)
		} else if statusFilter == status.CompletedKey {
			query = query.Where("status.key IN ?", data.StatusKeysCompleted)
		} else if statusFilter == status.ActiveKey {
			query = query.Where("active = true")
		} else {
			query = query.Where("status.key = ?", statusFilter)
		}
	}

	result := query.Find(&list)
	return &list, result.Error
}

func (r *assistanceRepository) GetByWS(mobile string) (*entities.Assistance, error) {
	var assistance entities.Assistance
	excludedStatuses := append(data.StatusKeyEnd, status.DriverCompletedKey)

	result := r.db.Joins("JOIN status ON status.id = a_assistance_requests.status_id").
		Not("status.key", excludedStatuses).
		Joins("JOIN ws_users ON a_assistance_requests.ws_user_id = ws_users.id AND ws_users.active = true AND ws_users.mobile = ?", mobile).
		Preload("User").
		Preload("WSUser").
		Preload("Driver").
		Preload("Vehicle").
		Preload("Vehicle.Make").
		Preload("Vehicle.Model").
		Preload("Vehicle.Type").
		Preload("Vehicle.EngineType").
		Preload("Vehicle.Weight").
		Preload("Vehicle.Color").
		Preload("Vehicle.DriveTrainType").
		Preload("TowTruck").
		Preload("TowTruck.Make").
		Preload("TowTruck.Type").
		Preload("TowTruck.Color").
		Preload("Status").
		Preload("Coin").
		First(&assistance)

	if result.Error != nil {
		log.Println(result.Error)
		return nil, result.Error
	}

	return &assistance, nil
}
