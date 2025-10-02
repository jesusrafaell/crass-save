package services

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type BrandService struct {
	repo repository.BrandRepository
}

func NewBrandService(db *gorm.DB) *BrandService {
	return &BrandService{
		repo: *repository.NewBrandRepository(db),
	}
}

func (s *BrandService) GetAll() (*[]model.Brand, error) {
	brands, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return brands, nil
}
