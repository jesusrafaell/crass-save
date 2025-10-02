package usecases

import (
	"context"

	"bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"

	"github.com/google/uuid"
)

type insurancesUsecaseImpl struct {
	insurancesRepository repositories.InsuranceRepository
}

func NewInsurancesUsecaseImpl(insurancesRepository repositories.InsuranceRepository) InsurancesUsecase {
	return &insurancesUsecaseImpl{
		insurancesRepository: insurancesRepository,
	}
}

func (u *insurancesUsecaseImpl) GetAll(ctx context.Context) (*[]entities.Insurance, error) {
	insurances, err := u.insurancesRepository.GetAll()
	if err != nil {
		return nil, err
	}
	return &insurances, nil
}

func (u *insurancesUsecaseImpl) GetByCountryID(ctx context.Context, countryID string) (*[]entities.Insurance, error) {
	countryUUID, err := uuid.Parse(countryID)
	if err != nil {
		return nil, err
	}

	insurances, err := u.insurancesRepository.GetByCountryID(countryUUID)
	if err != nil {
		return nil, err
	}
	return insurances, nil
}

func (u *insurancesUsecaseImpl) Create(ctx context.Context, req *models.AddInsuranceRequest) error {
	incurance := entities.Insurance{
		Name: req.Name,
	}
	err := u.insurancesRepository.Create(&incurance)
	if err != nil {
		return err
	}
	return nil
}

func (u *insurancesUsecaseImpl) GetByID(ctx context.Context, id uuid.UUID) (*models.Insurance, error) {
	insurance, err := u.insurancesRepository.GetByID(id)
	if err != nil {
		return nil, err
	}
	return entities.InsuranceToBase(insurance), nil
}

func (u *insurancesUsecaseImpl) GetByKey(ctx context.Context, key uint) (*models.Insurance, error) {
	insurance, err := u.insurancesRepository.GetByKey(key)
	if err != nil {
		return nil, err
	}
	return entities.InsuranceToBase(insurance), nil
}

func (u *insurancesUsecaseImpl) GetWithCountries(ctx context.Context) (*[]models.InsuranceWithCountries, error) {
	lang := utils.GetLang(ctx)
	insurances, err := u.insurancesRepository.GetWithCountries(lang)
	if err != nil {
		return nil, err
	}
	return insurances, nil
}

// func (u *insurancesUsecaseImpl) GetByCountry(ctx context.Context) (*[]models.InsuranceWithCountries, error) {
// 	lang := utils.GetLang(ctx)
// 	insurances, err := u.insurancesRepository.GetWithCountries(lang)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return insurances, nil
// }
