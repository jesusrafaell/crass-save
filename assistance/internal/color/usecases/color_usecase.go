package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/color/models"
	"bitbucket.org/mya/mya-assistance-core/internal/color/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"
)

type ColorUsecase interface {
	GetAll(ctx context.Context) (*[]models.Color, error)
}

type colorUsecaseImpl struct {
	colorRepository repositories.ColorRepository
}

func NewColorService(colorRepository repositories.ColorRepository) ColorUsecase {
	return &colorUsecaseImpl{
		colorRepository: colorRepository,
	}
}

func (u *colorUsecaseImpl) GetAll(ctx context.Context) (*[]models.Color, error) {
	lang := utils.GetLang(ctx)
	return u.colorRepository.GetAll(lang)
}
