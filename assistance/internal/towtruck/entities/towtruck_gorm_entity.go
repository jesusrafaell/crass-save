package entities

import (
	colorEntity "bitbucket.org/mya/mya-assistance-core/internal/color/entities"
	driveTrainTypesEntity "bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/entities"
	engineTypeEntity "bitbucket.org/mya/mya-assistance-core/internal/enginetype/entities"
	insuranceEntity "bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	WeightEntity "bitbucket.org/mya/mya-assistance-core/internal/weight/entities"

	countryEntity "bitbucket.org/mya/mya-assistance-core/internal/country/entities"

	companyEntity "bitbucket.org/mya/mya-assistance-core/internal/company/entities"

	userEntity "bitbucket.org/mya/mya-assistance-core/pkg/users/entities"

	"github.com/google/uuid"
)

type TowTruckGORM struct {
	ID           uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt    int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt    int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt    *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	Year         uint      `gorm:"column:year"`
	LicensePlate string    `gorm:"type:varchar(100);unique"`
	PolicyNumber *string   `gorm:"column:policy_number"`
	ImagePath    string    `gorm:"column:image_path;uniqueIndex"`
	Active       bool      `gorm:"column:active"`

	CompanyID uuid.UUID              `gorm:"foreignKey:CompanyId;column:company_id"`
	Company   *companyEntity.Company `json:"company,omitempty"`
	//remove ->
	DriverID *uuid.UUID `gorm:"foreignKey:DriverID;column:driver_id"`
	Driver   *userEntity.User

	MakeID uuid.UUID     `gorm:"foreignKey:MakeID;column:make_id"`
	Make   *TowTruckMake `json:"make,omitempty"`
	TypeId uuid.UUID     `gorm:"foreignKey:CraneTypeID;column:type_id"`
	Type   *TowTruckType `json:"craneType,omitempty"`

	//base
	EngineTypeID     uuid.UUID                             `gorm:"foreignKey:EngineTypeID;column:engine_type_id"`
	EngineType       *engineTypeEntity.EngineType          `json:"engineType,omitempty"`
	ColorID          uuid.UUID                             `gorm:"foreignKey:ColorID;column:color_id"`
	Color            *colorEntity.Color                    `json:"color,omitempty"`
	DriveTrainTypeID uuid.UUID                             `gorm:"foreignKey:DriveTrainTypeID;column:drive_train_type_id"`
	DriveTrainType   *driveTrainTypesEntity.DriveTrainType `json:"driveTrainType,omitempty"`
	WeightID         uuid.UUID                             `gorm:"foreignKey:WeightID;column:weight_id"`
	Weight           *WeightEntity.Weight                  `json:"weight,omitempty"`
	CountryID        uuid.UUID                             `gorm:"foreignKey:CountryID;column:country_id"`
	Country          *countryEntity.Country                `json:"country,omitempty"`

	InsuranceID uuid.UUID                  `gorm:"foreignKey:InsuranceID;column:insurance_id"`
	Insurance   *insuranceEntity.Insurance `json:"insurance,omitempty"`
}

func (TowTruckGORM) TableName() string {
	return "a_tow_trucks"
}

func ConvertTowTruckResponse(t TowTruckGORM, lang string) *models.TowTruck {
	policyNumber := ""
	if t.PolicyNumber != nil {
		policyNumber = *t.PolicyNumber
	}
	return &models.TowTruck{
		ID:             t.ID,
		Year:           t.Year,
		LicensePlate:   t.LicensePlate,
		ImagePath:      t.ImagePath,
		PolicyNumber:   &policyNumber,
		DriverID:       t.DriverID,
		Driver:         userEntity.ConvertUserToModel(t.Driver),
		Active:         t.Active,
		CreatedAt:      t.CreatedAt,
		UpdatedAt:      t.UpdatedAt,
		Make:           TowTruckMakeToBase(t.Make),
		Type:           TowTruckTypeToBase(t.Type, lang),
		EngineType:     engineTypeEntity.EngineTypeToBase(t.EngineType, lang),
		Weight:         WeightEntity.WeightToBase(t.Weight, lang),
		Color:          colorEntity.ColorToBase(t.Color, lang),
		DriveTrainType: driveTrainTypesEntity.DriveTrainToBase(t.DriveTrainType, lang),
		Country:        countryEntity.CountryToBase(t.Country, lang),
		Insurance:      insuranceEntity.InsuranceToBase(t.Insurance),
	}
}

func ConvertTowTruckDriver(t *TowTruckGORM, lang string) *models.TowTruckDriver {
	if t == nil {
		return nil
	}
	return &models.TowTruckDriver{
		ID:           t.ID,
		Year:         t.Year,
		LicensePlate: t.LicensePlate,
		ImagePath:    t.ImagePath,
		Make:         TowTruckMakeToBase(t.Make),
		Type:         TowTruckTypeToBase(t.Type, lang),
		Color:        colorEntity.ColorToBase(t.Color, lang),
	}
}
