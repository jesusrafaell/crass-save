package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"

	"github.com/google/uuid"
)

type AssistanceUsecase interface {
	Create(ctx context.Context, assistance *models.CreateAssistance) (*models.AssistanceResponse, *apierrors.CustomError)
	GetList(ctx context.Context, params *models.ParamsRequestGet) (*[]models.AssistanceResponse, error)
	// GetAll(ctx context.Context) (*[]models.AssistanceResponse, error)
	GetPendingByDriverID(ctx context.Context, driverID uuid.UUID) (*[]models.AssistanceResponse, error)
	GeByID(ctx context.Context, ID uuid.UUID) (*entities.Assistance, *apierrors.CustomError)
	GetByIDWithDetails(ctx context.Context, id uuid.UUID) (*models.AssistanceResponse, *apierrors.CustomError)
	// GetByUserOrDriverIDctx context.Context, (userID, driverID *uuid.UUID, lang string) (*models.AssistanceResponse, *apierrors.CustomError)
	GetByUserID(ctx context.Context) (*models.AssistanceResponse, *apierrors.CustomError)
	GetByDriverID(ctx context.Context) (*models.AssistanceResponse, *apierrors.CustomError)
	Cancel(ctx context.Context, assistance *models.CancelAssistance) *apierrors.CustomError
	// Updatectx context.Context, (id uuid.UUID, assistance *models.UpdateStatusAssistance) error
	ConfirmedDriver(ctx context.Context, assistance *models.ConfirmedAssistance) (*models.AssistanceResponse, *apierrors.CustomError)
	UpdateByDriver(ctx context.Context, assistance *models.UpdateStatusByDriver) *apierrors.CustomError
	DriverCompleted(ctx context.Context, assistance *models.CompletedStatus) *apierrors.CustomError
	ConfirmedUser(ctx context.Context, req *models.UpdateStatus) *apierrors.CustomError
	UserCompleted(ctx context.Context, assistance *models.CompletedStatus) *apierrors.CustomError
	GetByFilter(ctx context.Context, reqId, userId, driverId *uuid.UUID) (*models.AssistanceResponse, *apierrors.CustomError)
	GetDashboardDataByCompanyId(ctx context.Context, companyId *uuid.UUID) (*models.DashboarData, *apierrors.CustomError)
	GetAllByCompanyId(ctx context.Context, companyId *uuid.UUID, assistance *models.FilterDashboardRequest) (*[]models.AssistanceResponse, error)
	GetByWS(ctx context.Context, mobile string) (*models.AssistanceResponse, *apierrors.CustomError)
	// CalPriceAssistance(ctx context.Context, data *types.CalPriceKm) (*ratePricesModels.Price, error)
	// GetDistancePoints(ctx context.Context, origin, destination types.Location) float64
	// CalculateDistanceAndPrice(ctx context.Context, assistance *entities.Assistance) (*models.DistanceDriverAndPrice, *apierrors.CustomError)
	// FindDriverAndAddPending(ctx context.Context, assistance *entities.Assistance, maxRadius uint32) *apierrors.CustomError
	// FindOptionsDrivers(ctx context.Context, assistance *models.CreateAssistance) (*[]models.OptionsAssistanceResponse, *apierrors.CustomError)
}
