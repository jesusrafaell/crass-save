package country

import (
	"bitbucket.org/mya/mya-assistance-core/internal/country/repositories"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func Module(e *echo.Echo, db *sqlx.DB) repositories.CountryRepository {
	countryRepository := repositories.NewCountryRepository(db)
	countryService := NewCountryUsecaseImpl(countryRepository)
	Routes(e, NewCountryHandler(countryService))
	return countryRepository
}
