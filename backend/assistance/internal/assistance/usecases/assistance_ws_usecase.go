package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/utils"
)

func (s *assistanceUsecaseImpl) GetByWS(ctx context.Context, mobile string) (*models.AssistanceResponse, *apierrors.CustomError) {
	assistance, err := s.repository.GetByWS(mobile)
	if err != nil {
		return nil, &apierrors.AssistanceNotExist
	}

	lang := utils.GetLang(ctx)

	assistanceResponse := entities.ConvertAssistanceReqToResponse(assistance, lang)
	return assistanceResponse, nil
}
