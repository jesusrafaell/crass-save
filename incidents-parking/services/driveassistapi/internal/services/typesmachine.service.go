package services

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type TypeMachineService struct {
	repo repository.TypeMachineRepository
}

func NewTypeMachineService(db *gorm.DB) *TypeMachineService {
	return &TypeMachineService{
		repo: *repository.NewTypeMachineRepository(db),
	}
}

func (s *TypeMachineService) GetAll() (*[]model.TypeMachine, error) {
	types, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return types, nil
}
