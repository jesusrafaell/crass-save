package repository

import (
	"api/driveassist/data/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TypeMachineRepository struct {
	db *gorm.DB
}

func NewTypeMachineRepository(db *gorm.DB) *TypeMachineRepository {
	return &TypeMachineRepository{db: db}
}

func (repo *TypeMachineRepository) GetByID(id uuid.UUID) (*model.TypeMachine, error) {
	var data model.TypeMachine
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TypeMachineRepository) GetByName(name string) (*model.TypeMachine, error) {
	var data model.TypeMachine
	result := repo.db.Where("name = ?", name).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *TypeMachineRepository) Create(data *model.TypeMachine) error {
	result := repo.db.Create(data)
	return result.Error
}

func (repo *TypeMachineRepository) GetAll() (*[]model.TypeMachine, error) {
	var list []model.TypeMachine
	result := repo.db.Order("en ASC").Find(&list)
	return &list, result.Error
}

func (repo *TypeMachineRepository) Update(data *model.TypeMachine) error {
	result := repo.db.Save(data)
	return result.Error
}

func (repo *TypeMachineRepository) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.TypeMachine{}, id)
	return result.Error
}
