package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"

	"github.com/google/uuid"
)

type DriveTrainType struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        string    `db:"es,omitempty" json:"es,omitempty"`
	EN        string    `db:"en,omitempty" json:"en,omitempty"`
}

func (DriveTrainType) TableName() string {
	return "a_drive_train_types"

}

func DriveTrainToBase(driveTrain *DriveTrainType, lang string) *models.DriveTrainType {
	if driveTrain == nil {
		return nil
	}
	item := models.DriveTrainType{
		ID: driveTrain.ID,
	}
	if lang == "en" {
		item.Name = driveTrain.EN
	} else {
		item.Name = driveTrain.ES
	}
	return &item
}
