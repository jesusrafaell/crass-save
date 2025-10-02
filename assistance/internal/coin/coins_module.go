package coin

import (
	"bitbucket.org/mya/mya-assistance-core/internal/coin/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/coin/usecases"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func NewModule(e *echo.Echo, db *sqlx.DB) {
	coinRepository := repositories.NewCoinsRepository(db)
	coinService := usecases.NewCoinUsecaseImpl(coinRepository)
	routes.CoinHttp(e, handlers.NewCoinsHandler(coinService))
}
