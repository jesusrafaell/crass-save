package main

import (
	"api/driveassist/db"
	"api/driveassist/handlers"
	"api/driveassist/internal/services"
	"api/driveassist/middleware"
	"api/driveassist/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

type responseCapture struct {
	Writer   http.ResponseWriter
	Response *echo.Response
	Status   int
}

func (r *responseCapture) WriteHeader(code int) {
	r.Status = code
	r.Writer.WriteHeader(code)
}

func (r *responseCapture) Write(b []byte) (int, error) {
	return r.Writer.Write(b)
}

func (r *responseCapture) Header() http.Header {
	return r.Writer.Header()
}

func main() {
	e := echo.New()
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	env := os.Getenv("ENV")

	log.Printf("MODE: %s\n", env)

	port := os.Getenv("PORT")

	//databse
	db, err := db.NewConnectionDB()

	if err != nil {
		log.Fatalf("Error connect db %v\n", err)
	}

	// Middlewares
	e.Use(middleware.RegisterRequest)
	e.Use(middleware.UserIdRequest)
	e.Use(middleware.LangRequest)

	//instance services
	inService := services.NewInsurancesService(db)
	routes.Insurances(e, handlers.NewInsuranceHandler(*inService))

	typeService := services.NewTypeService(db)
	routes.Types(e, handlers.NewTypesHandler(*typeService))

	typeMachineService := services.NewTypeMachineService(db)
	routes.TypesMachine(e, handlers.NewTypesMachineHandler(*typeMachineService))

	brandService := services.NewBrandService(db)
	routes.Brands(e, handlers.NewsBrandHandler(*brandService))

	modelService := services.NewModelService(db)
	routes.Models(e, handlers.NewsModelHandler(*modelService))

	colorService := services.NewColorService(db)
	routes.Color(e, handlers.NewColorHandler(*colorService))

	countryService := services.NewCountryService(db)
	routes.Countries(e, handlers.NewCountryHandler(*countryService))

	driveTrainType := services.NewDriveTrainTypeService(db)
	routes.DriveTrainTypes(e, handlers.NewDriveTrainTypeHandler(*driveTrainType))

	weightService := services.NewWeightService(db)
	routes.Weights(e, handlers.NewWeightHandler(*weightService))

	//vehicle
	vehicleService := services.NewVehicleService(db)
	routes.Vehicles(e, handlers.NewVehicleHandler(*vehicleService))

	//TowTruck
	craneTypeService := services.NewCraneTypeService(db)
	routes.CraneTypes(e, handlers.NewCraneTypesHandler(*craneTypeService))

	makeTTService := services.NewMakeTowTruckService(db)
	routes.MakesTowTruck(e, handlers.NewsMakeTowTruckHandler(*makeTTService))

	towTruckService := services.NewTowTruckService(db)
	routes.Truck(e, handlers.NewTowTruckHandler(*towTruckService))

	//assitance
	assistanceService := services.NewAssistanceReqService(db)
	routes.AssistanceRequest(e, handlers.NewAssistanceReqHandler(*assistanceService))

	e.Logger.Fatal(e.Start(":" + port))
}
