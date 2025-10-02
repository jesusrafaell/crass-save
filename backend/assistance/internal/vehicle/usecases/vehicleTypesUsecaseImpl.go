package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"
)

type VehicleTypeUsecase interface {
	GetAll(ctx context.Context) (*[]models.VehicleType, error)
	GetAllByWS(ctx context.Context) (*[]models.VehicleType, error)
	GetByKey(ctx context.Context, key uint) (*models.VehicleType, error)
}

type vehicleTypeUsecaseImpl struct {
	vehicleTypeRepository repositories.TypeRepository
}

func NewVehicleTypeUsecaseImpl(vehicleTypeRepository repositories.TypeRepository) VehicleTypeUsecase {
	return &vehicleTypeUsecaseImpl{
		vehicleTypeRepository,
	}
}

func (s *vehicleTypeUsecaseImpl) GetAll(ctx context.Context) (*[]models.VehicleType, error) {
	lang := utils.GetLang(ctx)
	vehicleTypes, err := s.vehicleTypeRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return vehicleTypes, nil
}

func (s *vehicleTypeUsecaseImpl) GetAllByWS(ctx context.Context) (*[]models.VehicleType, error) {
	lang := utils.GetLang(ctx)
	vehicleTypes, err := s.vehicleTypeRepository.GetAllByWS(lang)
	if err != nil {
		return nil, err
	}
	return vehicleTypes, nil
}

func (s vehicleTypeUsecaseImpl) GetByKey(ctx context.Context, key uint) (*models.VehicleType, error) {
	lang := utils.GetLang(ctx)
	vehicleType, err := s.vehicleTypeRepository.GetByKey(lang, key)
	if err != nil {
		return nil, err
	}
	return vehicleType, nil
}
