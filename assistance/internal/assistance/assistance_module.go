package assistance

import (
	"os"

	"bitbucket.org/mya/mya-assistance-core/internal/assistance/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/usecases"

	"bitbucket.org/mya/mya-assistance-core/pkg/googlemaps"

	ratepriceRepository "bitbucket.org/mya/mya-assistance-core/internal/rateprice/repositories"
	towTruckRepository "bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"
	vehicleRepository "bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"

	companyRepository "bitbucket.org/mya/mya-assistance-core/internal/company/repositories"
	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"
	statusRepository "bitbucket.org/mya/mya-assistance-core/pkg/status/repositories"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type AssistanceModule struct {
	Repository repositories.AssistanceRepository
	Usecase    usecases.AssistanceUsecase
	Handler    *handlers.AssistanceHandler
}

func NewAssistanceModule(
	db *sqlx.DB,
	dbg *gorm.DB,
	userRepo users.UserRepository,
	statusRepo statusRepository.StatusRepository,
	vehicleRepo vehicleRepository.VehicleRepository,
	towTruckRepo towTruckRepository.TowTruckRepository,
	companyRepo companyRepository.CompanyRepository,
	insuranceRepo insuranceRepository.InsuranceRepository,
	priceRateRepo ratepriceRepository.RatePriceRepository,
	googleMaps googlemaps.GoogleMapsService,
) *AssistanceModule {
	botizeWebHook := os.Getenv("BOTIZE_WEBHOOK_REQUEST")

	assistanceRepo := repositories.NewAssistanceRepository(dbg)
	reqDriverRepo := repositories.NewRequestDriverRepository(db)
	assistanceUsecase := usecases.NewAssistanceUsecaseImpl(
		botizeWebHook,
		assistanceRepo,
		reqDriverRepo,
		userRepo,
		vehicleRepo,
		towTruckRepo,
		statusRepo,
		companyRepo,
		insuranceRepo,
		priceRateRepo,
		googleMaps,
	)

	assistanceHandler := handlers.NewAssistanceHandler(assistanceUsecase)

	return &AssistanceModule{
		Repository: assistanceRepo,
		Usecase:    assistanceUsecase,
		Handler:    &assistanceHandler,
	}
}

func (m *AssistanceModule) Routes(e *echo.Echo) {
	routes.AssistanceHttp(e, *m.Handler)
}
