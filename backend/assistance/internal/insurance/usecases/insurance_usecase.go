package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"

	"github.com/google/uuid"
)

type InsurancesUsecase interface {
	GetAll(ctx context.Context) (*[]entities.Insurance, error)
	GetByCountryID(ctx context.Context, countryID string) (*[]entities.Insurance, error)
	Create(ctx context.Context, req *models.AddInsuranceRequest) error
	GetByID(ctx context.Context, id uuid.UUID) (*models.Insurance, error)
	GetByKey(ctx context.Context, key uint) (*models.Insurance, error)
	GetWithCountries(ctx context.Context) (*[]models.InsuranceWithCountries, error)
	// GetByCountry(ctx context.Context, country string) (*[]models.InsuranceWithCountries, error)
}
