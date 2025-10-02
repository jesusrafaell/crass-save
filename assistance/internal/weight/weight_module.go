package weight

import (
	"bitbucket.org/mya/mya-assistance-core/internal/weight/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type WeightsModule struct {
	Repository repositories.WeightRepository
	Usecase    usecases.WeightUsecase
	Handler    *handlers.WeightsHandler
}

func NewWeightsModule(db *sqlx.DB) *WeightsModule {
	weightsRepository := repositories.NewWeightRepository(db)
	weightsUsecase := usecases.NeWeightUsecaseImpl(weightsRepository)
	weightsHandler := handlers.NewWeightHandler(weightsUsecase)
	return &WeightsModule{
		Repository: weightsRepository,
		Usecase:    weightsUsecase,
		Handler:    &weightsHandler,
	}
}

func (m *WeightsModule) Routes(e *echo.Echo) {
	routes.WeightsHttp(e, *m.Handler)
}
