package usecases

import (
	"context"
	"fmt"
	"strings"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"

	"github.com/google/uuid"
)

type VehicleMakeModelUsecase interface {
	CreateMake(ctx context.Context, make *entities.VehicleMake) error
	GetMakes(ctx context.Context) (*[]models.VehicleMake, error)
	GetMakeByModelID(ctx context.Context, modelID uuid.UUID) (*models.VehicleMake, *apierrors.CustomError)
	//
	CreateModel(ctx context.Context, req *models.CreateVehicleModel) (*models.VehicleModel, error)
	GetModelsByMakeID(ctx context.Context, makeID string) (*[]models.VehicleModel, error)
	GetModelsByMakeName(ctx context.Context, makeName string) (*[]models.VehicleModel, error)
	GetVehicleMakeAndModelByNames(ctx context.Context, makeName, modelName *string) (*models.VehicleMakeAndModel, error)
}

type vehicleMakeModelUsecaseImpl struct {
	vehicleMakeRepository  repositories.MakeRepository
	vehicleModelRepository repositories.ModelRepository
}

func NewMakeModelUsecaseImpl(
	vehicleMakeRepository repositories.MakeRepository,
	vehicleModelRepository repositories.ModelRepository,
) VehicleMakeModelUsecase {
	return &vehicleMakeModelUsecaseImpl{
		vehicleMakeRepository,
		vehicleModelRepository,
	}
}

func (u *vehicleMakeModelUsecaseImpl) GetMakes(ctx context.Context) (*[]models.VehicleMake, error) {
	return u.vehicleMakeRepository.GetAll()
}

func (u *vehicleMakeModelUsecaseImpl) GetMakeByModelID(ctx context.Context, modelID uuid.UUID) (*models.VehicleMake, *apierrors.CustomError) {
	make, err := u.vehicleMakeRepository.GetByModelID(modelID)
	if err != nil {
		return nil, &apierrors.MakeNotFound
	}
	return make, nil
}

func (u *vehicleMakeModelUsecaseImpl) CreateMake(ctx context.Context, make *entities.VehicleMake) error {
	err := u.vehicleMakeRepository.Create(make)
	if err != nil {
		return err
	}
	return nil
}

func (s *vehicleMakeModelUsecaseImpl) CreateModel(ctx context.Context, req *models.CreateVehicleModel) (*models.VehicleModel, error) {
	//createmake
	req.NewMake = strings.TrimSpace(req.NewMake)
	if req.NewMake != "" {
		make := &entities.VehicleMake{Name: req.NewMake}
		err := s.CreateMake(ctx, make)
		if err != nil {
			return nil, err
		}
		req.MakeID = make.ID
	}

	carModel := &models.VehicleModel{Name: req.Model}
	err := s.vehicleModelRepository.Create(carModel, req.MakeID)
	if err != nil {
		return nil, err
	}
	return carModel, nil
}

func (s *vehicleMakeModelUsecaseImpl) GetModelsByMakeID(ctx context.Context, makeID string) (*[]models.VehicleModel, error) {
	makeUUID, err := uuid.Parse(makeID)
	if err != nil {
		return nil, err
	}
	models, err := s.vehicleModelRepository.GetByMakeID(makeUUID)
	if err != nil {
		return nil, err
	}
	return models, nil
}

func (s *vehicleMakeModelUsecaseImpl) GetModelsByMakeName(ctx context.Context, makeName string) (*[]models.VehicleModel, error) {
	return s.vehicleModelRepository.GetByMakeName(makeName)
}

func (s *vehicleMakeModelUsecaseImpl) GetVehicleMakeAndModelByNames(ctx context.Context, makeName, modelName *string) (*models.VehicleMakeAndModel, error) {
	if (makeName == nil || *makeName == "") && (modelName == nil || *modelName == "") {
		return nil, fmt.Errorf("make or model not found")
	}
	return s.vehicleMakeRepository.GetVehicleMakeAndModelByNames(makeName, modelName)
}
