package usecases

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/models"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/repositories"
)

type WeightUsecase interface {
	GetAll(lang string) (*[]models.Weight, error)
	GetByKey(lang string, key uint) (*models.Weight, *apierrors.CustomError)
}

type weightUsecaseImpl struct {
	weightRepository repositories.WeightRepository
}

func NeWeightUsecaseImpl(weightRepository repositories.WeightRepository) WeightUsecase {
	return &weightUsecaseImpl{
		weightRepository: weightRepository,
	}
}

func (u *weightUsecaseImpl) GetAll(lang string) (*[]models.Weight, error) {
	weights, err := u.weightRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return weights, nil
}

func (u *weightUsecaseImpl) GetByKey(lang string, key uint) (*models.Weight, *apierrors.CustomError) {
	weight, err := u.weightRepository.GetByKey(lang, key)
	if err != nil {
		return nil, &apierrors.WeightNotFound
	}
	return weight, nil
}
