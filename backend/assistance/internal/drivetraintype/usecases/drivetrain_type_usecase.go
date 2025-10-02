package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/models"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"

	"github.com/google/uuid"
)

type DriveTrainTypeUsecase interface {
	GetAll(ctx context.Context) (*[]models.DriveTrainType, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.DriveTrainType, *apierrors.CustomError)
	Create(ctx context.Context, driveTrainType *models.CreateDriveTrainType) error
	Update(ctx context.Context, driveTrainType *models.UpdateDriveTrainType) *apierrors.CustomError
	Delete(ctx context.Context, id uuid.UUID) error
}

type driveTrainTypeUsecaseImpl struct {
	driveTrainTypeRepository repositories.DriveTrainTypeRepository
}

func NewDriveTrainTypeUsecaseImpl(driveTrainTypeRepository repositories.DriveTrainTypeRepository) DriveTrainTypeUsecase {
	return &driveTrainTypeUsecaseImpl{
		driveTrainTypeRepository: driveTrainTypeRepository,
	}
}

func (u *driveTrainTypeUsecaseImpl) GetAll(ctx context.Context) (*[]models.DriveTrainType, error) {
	lang := utils.GetLang(ctx)
	return u.driveTrainTypeRepository.GetAll(lang)
}

func (u *driveTrainTypeUsecaseImpl) GetByID(ctx context.Context, id uuid.UUID) (*models.DriveTrainType, *apierrors.CustomError) {
	lang := utils.GetLang(ctx)
	driveTrainType, err := u.driveTrainTypeRepository.GetByID(lang, id)
	if err != nil {
		return nil, &apierrors.DriverNotFound
	}
	return driveTrainType, nil
}

func (u *driveTrainTypeUsecaseImpl) Create(ctx context.Context, driveTrainType *models.CreateDriveTrainType) error {
	return u.driveTrainTypeRepository.Create(&entities.DriveTrainType{
		EN: driveTrainType.EN,
		ES: driveTrainType.ES,
	})
}

func (u *driveTrainTypeUsecaseImpl) Update(ctx context.Context, driveTrainType *models.UpdateDriveTrainType) *apierrors.CustomError {
	err := u.driveTrainTypeRepository.Update(&entities.DriveTrainType{
		ID: driveTrainType.ID,
		EN: driveTrainType.EN,
		ES: driveTrainType.ES,
	})
	if err != nil {
		return apierrors.NewCustomErrMsg(&apierrors.DriveTrainTypeNotFound, err.Error())
	}
	return nil
}

func (u *driveTrainTypeUsecaseImpl) Delete(ctx context.Context, id uuid.UUID) error {
	return u.driveTrainTypeRepository.Delete(id)
}
