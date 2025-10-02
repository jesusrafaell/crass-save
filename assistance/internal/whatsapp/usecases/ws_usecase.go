package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/apierrors"

	assistanceModels "bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/models"

	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

type WSUsecase interface {
	CreateAssistance(ctx context.Context, assistance *models.CreateWSAssistance) (*assistanceModels.AssistanceResponse, *apierrors.CustomError)
	GetAssistanceByMobile(ctx context.Context, parms *models.GetByMobile) (*assistanceModels.AssistanceResponse, *apierrors.CustomError)
	// GetOptionsRequest(lang string, assitance *models.CreateWSAssistance) (types.AssistanceWSOptionsResponse, *apierrors.CustomError)
	ConfirmatedRequest(ctx context.Context, req *models.ConfirmedRequest) *apierrors.CustomError
	CancelRequest(ctx context.Context, reqID uuid.UUID, desc string) *apierrors.CustomError
	GetVehicleTypes(ctx context.Context) (string, error)
	//check
	GetVehicleMakeModel(ctx context.Context, makeModel *models.WSVehicleMakeAndModel) (*models.VehicleMakeAndModelReponse, error)
	GetVehicleModelsByMake(ctx context.Context, makeName string) (*types.NameReponse, error)
	GetVehicleMakeAndModelByModel(ctx context.Context, modelName string) (*models.VehicleMakeAndModelReponse, error)
	GetDataUserWs(ctx context.Context, identityDocument string) (*models.WsUserBotize, *apierrors.CustomError)
	GetDataVehicleWs(ctx context.Context, licensePlate string) (*models.WSVehicleBotize, *apierrors.CustomError)
}
