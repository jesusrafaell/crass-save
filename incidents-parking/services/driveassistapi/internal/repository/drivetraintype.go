package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DriveTrainTypeRepository struct {
	db *gorm.DB
}

func NewDriveTrainTypeRepository(db *gorm.DB) *DriveTrainTypeRepository {
	return &DriveTrainTypeRepository{db: db}
}

func (repo *DriveTrainTypeRepository) GetByID(id uuid.UUID) (*model.DriveTrainType, error) {
	var data model.DriveTrainType
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *DriveTrainTypeRepository) Create(data *model.DriveTrainType) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *DriveTrainTypeRepository) GetAll() (*[]model.DriveTrainType, error) {
	var list []model.DriveTrainType
	result := repo.db.Order("created_at asc").Find(&list)
	return &list, result.Error
}

func (repo *DriveTrainTypeRepository) Update(data *model.DriveTrainType) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *DriveTrainTypeRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.DriveTrainType{}, id)
	return result.Error
}
