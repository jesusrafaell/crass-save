package routes

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/assistance"
	"bitbucket.org/mya/mya-assistance-core/internal/coin"
	"bitbucket.org/mya/mya-assistance-core/internal/color"
	"bitbucket.org/mya/mya-assistance-core/internal/company"
	"bitbucket.org/mya/mya-assistance-core/internal/country"
	"bitbucket.org/mya/mya-assistance-core/internal/drivetraintype"
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice"
	midd "bitbucket.org/mya/mya-assistance-core/internal/server/middleware"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle"
	"bitbucket.org/mya/mya-assistance-core/internal/weight"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp"
	"bitbucket.org/mya/mya-assistance-core/pkg/googlemaps"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

func Routes(e *echo.Echo, db *gorm.DB, pg *sqlx.DB) {
	e.Use(midd.InjectUserContext)
	// e.Use(midd.LangRequest)

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format:           "${time_custom} | ${method} | URL=${host}${uri} | STATUS=${status} | LATENCY=${latency_human} | USERID=${header:x-user-id} \n",
		CustomTimeFormat: "2006-01-02 15:04:05",
	}))

	googleMapsService := googlemaps.NewGoogleMapsService()

	//repo
	userRepo := users.NewUserRepository(pg)
	status := status.NewStatusModule(pg)

	engineType := enginetype.NewEngineTypesModule(pg)
	engineType.Routes(e)

	colorsModule := color.NewColorsModule(pg)
	colorsModule.Routes(e)

	drivetraintypes := drivetraintype.NewDriveTrainTypesModule(pg)
	drivetraintypes.Routes(e)

	coin.NewModule(e, pg)

	insurancesModule := insurance.NewInsurancesModule(pg)
	insurancesModule.Routes(e)
	weights := weight.NewWeightsModule(pg)
	weights.Routes(e)

	company := company.NewCompanyModule(pg)
	company.Routes(e)

	ratepricesModule := rateprice.NewRatePricesModule(pg)
	ratepricesModule.Routes(e)
	countryRepository := country.Module(e, pg)

	vehicle := vehicle.NewModule(pg)
	vehicle.Routes(e, insurancesModule.Repository)

	towTruck := towtruck.NewTowTruckModule(
		pg,
		company.Repository,
		insurancesModule.Repository,
	)
	towTruck.Routes(e)

	//asisstance
	assistanceModule := assistance.NewAssistanceModule(
		pg,
		db,
		userRepo,
		status.Repository,
		vehicle.VehiclesRepository,
		towTruck.TowTruckRepository,
		company.Repository,
		insurancesModule.Repository,
		ratepricesModule.Repository,
		googleMapsService,
	)
	assistanceModule.Routes(e)

	whatsappModule := whatsapp.NewWhatsAppModule(
		pg,
		assistanceModule.Usecase,
		vehicle.VehiclesRepository,
		vehicle.VehicleTypeRepository,
		vehicle.VehicleMakeRepository,
		vehicle.VehicleModelRepository,
		weights.Repository,
		countryRepository,
		userRepo,
	)
	whatsappModule.Routes(e)

	fmt.Println()
}
