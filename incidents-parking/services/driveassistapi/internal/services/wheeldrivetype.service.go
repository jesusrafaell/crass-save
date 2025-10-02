package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"

	"gorm.io/gorm"
)

type DriveTrainTypeService struct {
	dttypeRepo repo.DriveTrainTypeRepository
}

func NewDriveTrainTypeService(db *gorm.DB) *DriveTrainTypeService {
	return &DriveTrainTypeService{
		dttypeRepo: *repo.NewDriveTrainTypeRepository(db),
	}
}

func (s *DriveTrainTypeService) GetAll() (*[]model.DriveTrainType, error) {
	list, err := s.dttypeRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return list, nil
}
