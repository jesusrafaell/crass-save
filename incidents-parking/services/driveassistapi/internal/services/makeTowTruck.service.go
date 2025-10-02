package services

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type MakeTowTruckService struct {
	repo repository.MakeTowTruckRepository
}

func NewMakeTowTruckService(db *gorm.DB) *MakeTowTruckService {
	return &MakeTowTruckService{
		repo: *repository.NewMakeTowTruckRepository(db),
	}
}

func (s *MakeTowTruckService) GetAll() (*[]model.MakeTowTruck, error) {
	makes, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return makes, nil
}
