package services

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type ColorService struct {
	repo repository.ColorRepository
}

func NewColorService(db *gorm.DB) *ColorService {
	return &ColorService{
		repo: *repository.NewColorRepository(db),
	}
}

func (s *ColorService) GetAll() (*[]model.Color, error) {
	colors, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return colors, nil
}
