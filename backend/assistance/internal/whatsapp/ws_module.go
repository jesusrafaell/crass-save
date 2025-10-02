package whatsapp

import (
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/handlers"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/repositories"

	assistanceUsecases "bitbucket.org/mya/mya-assistance-core/internal/assistance/usecases"
	countryRepository "bitbucket.org/mya/mya-assistance-core/internal/country/repositories"

	vehicleRepository "bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	weightRepository "bitbucket.org/mya/mya-assistance-core/internal/weight/repositories"

	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/routes"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/usecases"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

type WhatsAppModule struct {
	Usecase usecases.WSUsecase
	Handler *handlers.WsHandler
}

func NewWhatsAppModule(db *sqlx.DB,
	assistanceUsecase assistanceUsecases.AssistanceUsecase,
	vehicleRepo vehicleRepository.VehicleRepository,
	vehicleTypeRepo vehicleRepository.TypeRepository,
	vehicleMakeRepo vehicleRepository.MakeRepository,
	vehicleModelRepo vehicleRepository.ModelRepository,
	weightRepo weightRepository.WeightRepository,
	countryRepo countryRepository.CountryRepository,
	userRepo users.UserRepository,
) *WhatsAppModule {

	whatsappRepo := repositories.NewWsRepository(db)
	whatsappUsecase := usecases.NewWSUsecaseImpl(
		whatsappRepo,
		assistanceUsecase,
		vehicleRepo,
		vehicleTypeRepo,
		vehicleMakeRepo,
		vehicleModelRepo,
		weightRepo,
		countryRepo,
		userRepo,
	)
	whatsappHandler := handlers.NewWsHandler(whatsappUsecase)

	return &WhatsAppModule{
		Usecase: whatsappUsecase,
		Handler: &whatsappHandler,
	}
}

func (m *WhatsAppModule) Routes(e *echo.Echo) {
	routes.WhatsappHttp(e, *m.Handler)
}
