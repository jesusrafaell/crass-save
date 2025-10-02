package insurance

import (
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type InsurancesModule struct {
	Repository repositories.InsuranceRepository
}

func NewInsurancesModule(db *sqlx.DB) *InsurancesModule {
	repo := repositories.NewInsuranceRepository(db)
	return &InsurancesModule{
		Repository: repo,
	}
}

func (m *InsurancesModule) Routes(e *echo.Echo) {
	usecase := usecases.NewInsurancesUsecaseImpl(m.Repository)
	handler := handlers.NewInsuranceHandler(usecase)
	routes.InsurancesHttp(e, handler)
}
