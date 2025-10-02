package entities

import "github.com/google/uuid"

type VehicleMake struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;column:name" json:"name" db:"name"`
}

func (v *VehicleMake) TableName() string {
	return "a_vehicles_makes"
}

type VehicleModel struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;column:name" json:"name" db:"name"`
}

func (v *VehicleModel) TableName() string {
	return "a_vehicles_models"
}

type MakeModel struct {
	MakeID  uuid.UUID `db:"make_id"`
	ModelID uuid.UUID `db:"model_id"`
}

func (MakeModel) TableName() string {
	return "a_vehicles_makes_models"
}
