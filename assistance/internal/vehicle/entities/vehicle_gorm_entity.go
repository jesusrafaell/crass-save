package entities

import (
	colorEntity "bitbucket.org/mya/mya-assistance-core/internal/color/entities"
	driveTrainTypesEntity "bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/entities"
	engineTypesEntity "bitbucket.org/mya/mya-assistance-core/internal/enginetype/entities"
	insurancesEntities "bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	WeightEntity "bitbucket.org/mya/mya-assistance-core/internal/weight/entities"

	countryEntity "bitbucket.org/mya/mya-assistance-core/internal/country/entities"

	"github.com/google/uuid"
)

type VehicleGORM struct {
	ID           uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt    int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt    int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt    *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	MakeID       uuid.UUID `gorm:"foreignKey:MakeID;column:make_id" json:"makeId"`
	Year         uint      `gorm:"column:year" json:"year"`
	LicensePlate string    `gorm:"type:varchar(100);unique" json:"licensePlate"`
	PolicyNumber *string   `gorm:"column:policy_number" json:"policyNumber"`
	ImagePath    string    `gorm:"column:image_path;" json:"imagePath"`
	UserID       uuid.UUID `gorm:"foreignKey:UserID;column:user_id" json:"userId"`
	Active       bool      `gorm:"column:active" json:"active"`

	Make             *VehicleMake                          `json:"make,omitempty"`
	ModelID          uuid.UUID                             `gorm:"foreignKey:ModelID;column:model_id" json:"modelId"`
	Model            *VehicleModel                         `json:"model,omitempty"`
	TypeID           uuid.UUID                             `gorm:"foreignKey:TypeID;column:type_id" json:"typeId"`
	Type             *VehicleType                          `json:"type,omitempty"`
	WeightID         uuid.UUID                             `gorm:"foreignKey:WeightID;column:weight_id" json:"weightId"`
	Weight           *WeightEntity.Weight                  `json:"weight,omitempty"`
	EngineTypeID     uuid.UUID                             `gorm:"foreignKey:EngineTypeID;column:engine_type_id" json:"engineTypeId"`
	EngineType       *engineTypesEntity.EngineType         `json:"engineType,omitempty"`
	ColorID          uuid.UUID                             `gorm:"foreignKey:ColorID;column:color_id" json:"colorId"`
	Color            *colorEntity.Color                    `json:"color,omitempty"`
	DriveTrainTypeID uuid.UUID                             `gorm:"foreignKey:DriveTrainTypeID;column:drive_train_type_id" json:"driveTrainTypeId"`
	DriveTrainType   *driveTrainTypesEntity.DriveTrainType `json:"driveTrainType,omitempty"`
	InsuranceID      uuid.UUID                             `gorm:"foreignKey:InsuranceID;column:insurance_id" json:"insuranceId"`
	Insurance        *insurancesEntities.Insurance         `json:"insurance,omitempty"`
	CountryID        uuid.UUID                             `gorm:"foreignKey:CountryID;column:country_id" json:"countryId"`
	Country          *countryEntity.Country                `json:"country,omitempty"`

	WsUserID *uuid.UUID `gorm:"column:ws_user_id"  json:"wsUserID"`
}

func (v *VehicleGORM) TableName() string {
	return "a_vehicles"
}

type VehicleType struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        string    `gorm:"type:varchar(100);uniqueIndex;column:es" json:"es"`
	EN        string    `gorm:"type:varchar(100);uniqueIndex;column:en" json:"en"`
	Key       uint      `gorm:"column:key" json:"key"`
}

func (v *VehicleType) TableName() string {
	return "a_vehicles_types"
}

func VehicleTypeToBase(vehcileType *VehicleType, lang string) *models.VehicleType {
	if vehcileType == nil {
		return nil
	}
	item := models.VehicleType{
		ID:  vehcileType.ID,
		Key: vehcileType.Key,
	}
	if lang == "en" {
		item.Name = vehcileType.EN
	} else {
		item.Name = vehcileType.ES
	}
	return &item
}

func ConvertVehicleToVehicleUser(vehicle *VehicleGORM, lang string) *models.VehicleUser {
	return &models.VehicleUser{
		ID:           vehicle.ID,
		Year:         vehicle.Year,
		LicensePlate: vehicle.LicensePlate,
		ImagePath:    vehicle.ImagePath,
		Make: &models.VehicleMake{
			ID:   vehicle.Make.ID,
			Name: vehicle.Make.Name,
		},
		Model: &models.VehicleModel{
			ID:   vehicle.Model.ID,
			Name: vehicle.Model.Name,
		},
		Type:           VehicleTypeToBase(vehicle.Type, lang),
		EngineType:     engineTypesEntity.EngineTypeToBase(vehicle.EngineType, lang),
		Weight:         WeightEntity.WeightToBase(vehicle.Weight, lang),
		Color:          colorEntity.ColorToBase(vehicle.Color, lang),
		DriveTrainType: driveTrainTypesEntity.DriveTrainToBase(vehicle.DriveTrainType, lang),
	}
}

func ConvertVehicleToVehicleResponse(vehicle VehicleGORM, lang string) *models.Vehicle {
	policyNumber := ""
	if vehicle.PolicyNumber != nil {
		policyNumber = *vehicle.PolicyNumber
	}

	return &models.Vehicle{
		ID:           vehicle.ID,
		Year:         vehicle.Year,
		LicensePlate: vehicle.LicensePlate,
		ImagePath:    vehicle.ImagePath,
		PolicyNumber: &policyNumber,
		UserID:       vehicle.UserID,
		CreatedAt:    vehicle.CreatedAt,
		UpdatedAt:    vehicle.UpdatedAt,
		Make: &models.VehicleMake{
			ID:   vehicle.Make.ID,
			Name: vehicle.Make.Name,
		},
		Model: &models.VehicleModel{
			ID:   vehicle.Model.ID,
			Name: vehicle.Model.Name,
		},
		Type:           VehicleTypeToBase(vehicle.Type, lang),
		EngineType:     engineTypesEntity.EngineTypeToBase(vehicle.EngineType, lang),
		Weight:         WeightEntity.WeightToBase(vehicle.Weight, lang),
		Color:          colorEntity.ColorToBase(vehicle.Color, lang),
		DriveTrainType: driveTrainTypesEntity.DriveTrainToBase(vehicle.DriveTrainType, lang),
		Country:        countryEntity.CountryToBase(vehicle.Country, lang),
		Insurance:      insurancesEntities.InsuranceToBase(vehicle.Insurance),
	}
}
