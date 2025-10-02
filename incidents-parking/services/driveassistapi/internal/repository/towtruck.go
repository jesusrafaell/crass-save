package repository

import (
	"api/driveassist/data/model"
	codeError "api/driveassist/util/errorcodes"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TowTruckRepository struct {
	db *gorm.DB
}

func NewTowTruckRepository(db *gorm.DB) *TowTruckRepository {
	return &TowTruckRepository{db: db}
}

func (repo *TowTruckRepository) GetByID(id uuid.UUID) (*model.TowTruck, error) {
	var data model.TowTruck
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TowTruckRepository) GetByLicensePlate(licensePlate string) (*model.TowTruck, error) {
	var data model.TowTruck
	result := repo.db.Where("licensePlate = ?", licensePlate).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TowTruckRepository) GetByInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) (*model.TowTruck, error) {
	var data model.TowTruck
	result := repo.db.Where("insurance_id = ? AND policy_number = ?", insuranceID, policyNumber).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TowTruckRepository) Create(data *model.TowTruck) *codeError.CustomError {
	result := repo.db.Create(&data)
	if result.Error != nil {
		return parsetowTruckError(result.Error)
	}

	return nil
}

func (repo *TowTruckRepository) GetAll() (*[]model.TowTruck, error) {
	var list []model.TowTruck
	result := repo.db.
		Preload("Make").
		Preload("TypeMachine").
		Preload("Color").
		Preload("DriveTrainType").
		Preload("Insurance").
		Preload("Country").
		Preload("CraneType").
		Preload("Weight").
		Order("created_at ASC").
		Find(&list)

	log.Println(list)
	log.Println(result.Error)
	if result.Error == gorm.ErrRecordNotFound {
		return &list, nil
	}
	return &list, result.Error
}

func (repo *TowTruckRepository) GetByUserID(userID uuid.UUID) (*[]model.TowTruck, error) {
	var list []model.TowTruck
	result := repo.db.
		Where("user_id = ?", userID).
		Preload("Make").
		Preload("TypeMachine").
		Preload("Color").
		Preload("DriveTrainType").
		Preload("Insurance").
		Preload("Country").
		Preload("Weight").
		Preload("CraneType").
		Order("created_at ASC").
		Find(&list)
	if result.Error == gorm.ErrRecordNotFound {
		return &list, nil
	}
	return &list, result.Error
}

func (repo *TowTruckRepository) Update(data *model.TowTruck) error {
	result := repo.db.Save(data)

	if result.Error != nil {
		return parsetowTruckError(result.Error)
	}

	return nil
}

func (repo *TowTruckRepository) Delete(id uuid.UUID) error {
	//time
	result := repo.db.Delete(&model.TowTruck{
		DeletedAt: time.Now().Unix(),
	}, id)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return codeError.NewCustomError("towtruckNotFound")
	}
	return nil
}

func parsetowTruckError(err error) *codeError.CustomError {
	//duplicates
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(err.Error(), "\"vehicles_tuition_key\""):
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
