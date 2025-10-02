package enginetype

import (
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type EngineTypesModule struct {
	Repository repositories.EngineTypeRepository
	Usecase    usecases.EngineTypeUsecase
	Handler    *handlers.EngineTypeHandler
}

func NewEngineTypesModule(db *sqlx.DB) *EngineTypesModule {
	engineTypesRepository := repositories.NewEngineTypeRepository(db)
	engineTypesUsecase := usecases.NewEngineTypeService(engineTypesRepository)
	engineTypesHandler := handlers.NewEngineTypeHandler(engineTypesUsecase)
	return &EngineTypesModule{
		Repository: engineTypesRepository,
		Usecase:    engineTypesUsecase,
		Handler:    &engineTypesHandler,
	}
}

func (m *EngineTypesModule) Routes(e *echo.Echo) {
	routes.EngineTypesHttp(e, *m.Handler)
}
