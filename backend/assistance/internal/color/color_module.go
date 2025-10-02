package color

import (
	"bitbucket.org/mya/mya-assistance-core/internal/color/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/color/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/color/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/color/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type ColorsModule struct {
	Repository repositories.ColorRepository
}

func NewColorsModule(db *sqlx.DB) *ColorsModule {
	colorsRepository := repositories.NewColorRepository(db)
	return &ColorsModule{
		Repository: colorsRepository,
	}
}

func (m *ColorsModule) Routes(e *echo.Echo) {
	colorsUsecase := usecases.NewColorService(m.Repository)
	colorsHandler := handlers.NewColorHandler(colorsUsecase)
	routes.ColorRoutesHttp(e, colorsHandler)
}
