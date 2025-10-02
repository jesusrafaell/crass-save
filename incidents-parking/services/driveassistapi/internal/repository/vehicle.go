package repository

import (
	"api/driveassist/data/model"
	codeError "api/driveassist/util/errorcodes"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VehicleRepository struct {
	db *gorm.DB
}

func NewVehicleRepository(db *gorm.DB) *VehicleRepository {
	return &VehicleRepository{db: db}
}

func (repo *VehicleRepository) GetByID(id uuid.UUID) (*model.Vehicle, error) {
	var data model.Vehicle
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *VehicleRepository) GetByTuition(tuition string) (*model.Vehicle, error) {
	var data model.Vehicle
	result := repo.db.Where("tuition = ?", tuition).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *VehicleRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*model.Vehicle, error) {
	var data model.Vehicle
	result := repo.db.Where("insurance_id = ? AND policy_number = ?", insuranceID, policyNumber).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *VehicleRepository) Create(data *model.Vehicle) *codeError.CustomError {
	result := repo.db.Create(&data)
	if result.Error != nil {
		return parseVehicleError(result.Error)
	}

	return nil
}

func (repo *VehicleRepository) GetAll() (*[]model.Vehicle, error) {
	var list []model.Vehicle
	result := repo.db.
		Preload("Country").
		Preload("Brand").
		Preload("Model").
		Preload("Type").
		Preload("TypeMachine").
		Preload("Insurance").
		Preload("Weight").
		Preload("Color").
		Preload("DriveTrainType").
		Order("created_at ASC").
		Find(&list)
	if result.Error == gorm.ErrRecordNotFound {
		return &list, nil
	}
	return &list, result.Error
}

func (repo *VehicleRepository) GetByUserID(userID uuid.UUID) (*[]model.Vehicle, error) {
	var list []model.Vehicle
	result := repo.db.
		Where("user_id = ?", userID).
		Preload("Country").
		Preload("Brand").
		Preload("Model").
		Preload("Type").
		Preload("TypeMachine").
		Preload("Insurance").
		Preload("Weight").
		Preload("DriveTrainType").
		Preload("Color").
		Order("created_at ASC").
		Find(&list)
	if result.Error == gorm.ErrRecordNotFound {
		return &list, nil
	}
	return &list, result.Error
}

func (repo *VehicleRepository) Update(data *model.Vehicle) error {
	result := repo.db.Save(data)

	if result.Error != nil {
		return parseVehicleError(result.Error)
	}

	return nil
}

func (repo *VehicleRepository) Delete(id uuid.UUID) error {
	//time
	result := repo.db.Delete(&model.Vehicle{
		DeletedAt: time.Now().Unix(),
	}, id)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return codeError.NewCustomError("vehicleNotFound")
	}
	return nil
}

func parseVehicleError(err error) *codeError.CustomError {
	//duplicates
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(err.Error(), "\"dat_vehicle_tuition_key\""):
			return codeError.NewCustomError("existLicensePlate")
		case strings.Contains(err.Error(), "\"idx_vehicles_image_path\""):
			return codeError.NewCustomError("existImagePath")
		}
	}
	//foreign key
	if strings.Contains(err.Error(), "violates foreign key constraint") {
		switch {
		case strings.Contains(err.Error(), "fk_brands_vehicles"):
			return codeError.NewCustomError("brandNotFound")
		case strings.Contains(err.Error(), "fk_models_vehicles"):
			return codeError.NewCustomError("modelNotFound")
		case strings.Contains(err.Error(), "fk_type_machines_vehicles"):
			return codeError.NewCustomError("typeMachineNotFound")
		case strings.Contains(err.Error(), "fk_types_vehicles"):
			return codeError.NewCustomError("typeNotFound")
		case strings.Contains(err.Error(), "fk_vehicles_weight"):
			return codeError.NewCustomError("weightNotFound")
		case strings.Contains(err.Error(), "fk_insurances_vehicles"):
			return codeError.NewCustomError("insuranceNotFound")
		case strings.Contains(err.Error(), "fk_vehicles_color"):
			return codeError.NewCustomError("colorNotFound")
		}
	}

	errorData := codeError.NewCustomError("invalidRequest")
	errorData.Name = err.Error()
	return errorData
}
