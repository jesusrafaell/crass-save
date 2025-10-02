package towtruck

import (
	"fmt"

	companyRepository "bitbucket.org/mya/mya-assistance-core/internal/company/repositories"
	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/handler"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type TowTruckModule struct {
	TowTruckRepository   repositories.TowTruckRepository
	TowTruckTypesUsecase usecases.TowTruckTypesUsecase
	TowTruckMakesUseCase usecases.TowTruckMakesUsecase
	TowTruckUseCase      usecases.TowTruckUsecase
}

func NewTowTruckModule(
	db *sqlx.DB,
	companyRepo companyRepository.CompanyRepository,
	insuranceRepo insuranceRepository.InsuranceRepository,
) *TowTruckModule {
	towTruckTypesRepository := repositories.NewTowTruckTypesRepository(db)
	towTruckTypesUsecase := usecases.NewTowTruckTypesUsecaseImpl(towTruckTypesRepository)

	towTruckMakeRepository := repositories.NewTowTruckMakeRepository(db)
	towTruckMakesUsecase := usecases.NewTowTruckMakesUsecaseImpl(towTruckMakeRepository)

	towTruckRepository := repositories.NewTowTruckRepository(db)
	towTruckUsecase := usecases.NewTowTruckUsecaseImpl(towTruckRepository, companyRepo, insuranceRepo)

	return &TowTruckModule{
		towTruckRepository,
		towTruckTypesUsecase,
		towTruckMakesUsecase,
		towTruckUsecase,
	}
}

func (m *TowTruckModule) Routes(e *echo.Echo) {
	fmt.Printf("TowTruck Routes:\n")
	routes.TowTruckTypes(e, handler.NewCraneTypesHandler(m.TowTruckTypesUsecase))
	routes.TowTruckMakes(e, handler.NewTowTruckMakeHandler(m.TowTruckMakesUseCase))
	routes.TowTrucks(e, handler.NewTowTruckHandler(m.TowTruckUseCase))
	fmt.Printf("--\n")
}
