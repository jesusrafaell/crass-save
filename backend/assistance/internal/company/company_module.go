package company

import (
	"bitbucket.org/mya/mya-assistance-core/internal/company/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/company/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/company/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/company/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type CompanyModule struct {
	Repository repositories.CompanyRepository
	Handler    *handlers.CompanyHandler
}

func NewCompanyModule(db *sqlx.DB) *CompanyModule {
	repository := repositories.NewCompanyRepository(db)
	usecase := usecases.NewCompanyUsecaseImpl(repository)
	handler := handlers.NewCompanyHandler(usecase)

	return &CompanyModule{
		Repository: repository,
		Handler:    &handler,
	}
}

func (m *CompanyModule) Routes(e *echo.Echo) {
	routes.CompanyHttp(e, *m.Handler)
}
