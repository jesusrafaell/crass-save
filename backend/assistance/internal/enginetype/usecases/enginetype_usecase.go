package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/models"
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"
)

type EngineTypeUsecase interface {
	GetAll(ctx context.Context) (*[]models.EngineType, error)
}

type engineTypeUsecaseImpl struct {
	engineTypeRepository repositories.EngineTypeRepository
}

func NewEngineTypeService(engineTypeRepository repositories.EngineTypeRepository) EngineTypeUsecase {
	return &engineTypeUsecaseImpl{
		engineTypeRepository: engineTypeRepository,
	}
}

func (u *engineTypeUsecaseImpl) GetAll(ctx context.Context) (*[]models.EngineType, error) {
	lang := utils.GetLang(ctx)
	engineTypes, err := u.engineTypeRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return engineTypes, nil
}
