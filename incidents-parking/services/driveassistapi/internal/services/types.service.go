package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type TypeService struct {
	typeRepo repo.TypeRepository
}

func NewTypeService(db *gorm.DB) *TypeService {
	return &TypeService{
		typeRepo: *repo.NewTypeRepository(db),
	}
}

func (s *TypeService) GetAll() (*[]model.Type, error) {
	types, err := s.typeRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return types, nil
}
