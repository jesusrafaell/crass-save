package rateprice

import (
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type RatePricesModule struct {
	Repository repositories.RatePriceRepository
}

func NewRatePricesModule(db *sqlx.DB) *RatePricesModule {
	ratePriceRepo := repositories.NewRatePriceRepository(db)

	return &RatePricesModule{
		Repository: ratePriceRepo,
	}
}

func (m *RatePricesModule) Routes(e *echo.Echo) {
	ratePriceUsecase := usecases.NewRatePriceUsecaseImpl(m.Repository)
	ratePriceHandler := handlers.NewRatePriceHandler(ratePriceUsecase)
	routes.RatePricesHttp(e, ratePriceHandler)
}
