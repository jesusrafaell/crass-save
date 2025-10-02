package country

import (
	"bitbucket.org/mya/mya-assistance-core/internal/country/models"
	"bitbucket.org/mya/mya-assistance-core/internal/country/repositories"
)

type CountryUsecase interface {
	GetAll(lang string) (*[]models.Country, error)
	GetByKey(lang string, key uint) (*models.Country, error)
}

type countryUsecaseImpl struct {
	countryRepo repositories.CountryRepository
}

func NewCountryUsecaseImpl(repository repositories.CountryRepository) CountryUsecase {
	return &countryUsecaseImpl{
		countryRepo: repository,
	}
}

func (u *countryUsecaseImpl) GetAll(lang string) (*[]models.Country, error) {
	contries, err := u.countryRepo.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return contries, nil
}

func (u *countryUsecaseImpl) GetByKey(lang string, key uint) (*models.Country, error) {
	country, err := u.countryRepo.GetByKey(lang, key)
	if err != nil {
		return nil, err
	}
	return country, nil
}
