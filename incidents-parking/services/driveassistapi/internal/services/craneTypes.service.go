package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type CraneTypeService struct {
	typeRepo repo.CraneTypeRepository
}

func NewCraneTypeService(db *gorm.DB) *CraneTypeService {
	return &CraneTypeService{
		typeRepo: *repo.NewCraneTypeRepository(db),
	}
}

func (s *CraneTypeService) GetAll() (*[]model.CraneType, error) {
	types, err := s.typeRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return types, nil
}
