package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"
	"api/driveassist/types"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ModelService struct {
	repoModel repo.ModelRepository
	repoBrand repo.BrandRepository
}

func NewModelService(db *gorm.DB) *ModelService {
	return &ModelService{
		repoModel: *repo.NewModelRepository(db),
		repoBrand: *repo.NewBrandRepository(db),
	}
}

func (s *ModelService) GetByBrandID(brandId string) (*[]model.Model, error) {
	brandUUID, err := uuid.Parse(brandId)
	if err != nil {
		return nil, err
	}
	models, err := s.repoModel.GetByBrandID(brandUUID)
	if err != nil {
		return nil, err
	}
	return models, nil
}

func (s *ModelService) CreateModel(req types.ModelRquest) (*model.Model, error) {
	//create brand
	req.NewBrand = strings.TrimSpace(req.NewBrand)
	if req.NewBrand != "" {
		brand := model.Brand{Name: req.NewBrand}
		err := s.repoBrand.Create(&brand)
		if err != nil {
			return nil, err
		}
		req.BrandID = brand.ID
	}

	carModel := model.Model{Name: req.Model}
	err := s.repoModel.Create(&carModel, req.BrandID)
	if err != nil {
		return nil, err
	}
	return &carModel, nil
}
