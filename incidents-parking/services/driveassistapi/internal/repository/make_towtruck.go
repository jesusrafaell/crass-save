package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MakeTowTruckRepository struct {
	db *gorm.DB
}

func NewMakeTowTruckRepository(db *gorm.DB) *MakeTowTruckRepository {
	return &MakeTowTruckRepository{db: db}
}

func (repo *MakeTowTruckRepository) GetByID(id uuid.UUID) (*model.MakeTowTruck, error) {
	var data model.MakeTowTruck
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *MakeTowTruckRepository) GetByName(name string) (*model.MakeTowTruck, error) {
	var data model.MakeTowTruck
	result := repo.db.Where("name = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *MakeTowTruckRepository) Create(data *model.MakeTowTruck) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *MakeTowTruckRepository) GetAll() (*[]model.MakeTowTruck, error) {
	var list []model.MakeTowTruck
	result := repo.db.Order("name ASC").Find(&list)
	return &list, result.Error
}

func (repo *MakeTowTruckRepository) Update(data *model.MakeTowTruck) error {
	result := repo.db.Save(&data)
	return result.Error
}

func (repo *MakeTowTruckRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.MakeTowTruck{}, id)
	return result.Error
}
