package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"

	"github.com/google/uuid"
)

type RatePriceUsecase interface {
	GetAll(ctx context.Context) (*[]entities.RatePriceXType, error)
	GetTypeRatePrices(ctx context.Context) (*models.TypeRatePrices, error)
	Update(ctx context.Context, id uuid.UUID, ratePriceXType *models.UpdateRatePriceXType) *apierrors.CustomError
	GetPriceXKm(ctx context.Context, vehicleType uuid.UUID, distanceMeters float64) (*models.Price, *apierrors.CustomError)
}
