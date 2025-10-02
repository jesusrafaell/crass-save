package routes

import (
	"crashsaver/parking/handlers"
	"crashsaver/parking/internal/services"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func Initialization(e *echo.Echo, db *sqlx.DB) {
	statusService := services.NewStatusService(db)
	Status(e, handlers.NewsStatusHandler(*statusService))

	pkServices := services.NewPkSVCService(db)
	PkServices(e, handlers.NewPkSVCHandler(*pkServices))

	companyService := services.NewCompanyService(db)
	Company(e, handlers.NewCompanyHandler(*companyService))

	parkingService := services.NewParkingService(db, pkServices, statusService)
	Parking(e, handlers.NewParkingHandler(*parkingService))

	bookingService := services.NewBookingService(db, companyService, parkingService, statusService)
	Booking(e, handlers.NewBookingHandler(*bookingService))

	tpvService := services.NewTpvService(db)
	Tpv(e, handlers.NewsTpvHandler(*tpvService))

	productsService := services.NewProductsService(db, tpvService)
	Products(e, handlers.NewsProductsHandler(*productsService))

	licensePlateXCompanyService := services.NewLicensePlateXCompanyService(db)
	LicensePlateXCompany(e, handlers.NewLicensePlateXCompanyHandler(*licensePlateXCompanyService))
}
