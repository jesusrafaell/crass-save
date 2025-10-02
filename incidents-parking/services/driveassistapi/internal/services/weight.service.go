package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type WeightService struct {
	typeRepo repo.WeightRepository
}

func NewWeightService(db *gorm.DB) *WeightService {
	return &WeightService{
		typeRepo: *repo.NewWeightRepository(db),
	}
}

func (s *WeightService) GetAll() (*[]model.Weight, error) {
	weights, err := s.typeRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return weights, nil
}
