package models

import "github.com/google/uuid"

type DriveTrainType struct {
	ID   uuid.UUID `json:"id" db:"id"`
	Name string    `db:"name" json:"name"`
}

func (DriveTrainType) TableName() string {
	return "a_drive_train_types"

}

type CreateDriveTrainType struct {
	ES string `db:"es,omitempty" json:"es,omitempty" vallidate:"required"`
	EN string `db:"en,omitempty" json:"en,omitempty" vallidate:"required"`
}

type UpdateDriveTrainType struct {
	ID uuid.UUID `json:"id" db:"id"`
	ES string    `db:"es,omitempty" json:"es,omitempty" vallidate:"required"`
	EN string    `db:"en,omitempty" json:"en,omitempty" vallidate:"required"`
}
